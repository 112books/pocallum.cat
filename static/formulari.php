<?php
/**
 * Formulari de contacte de pocallum.cat — endpoint propi a Dinahosting.
 *
 * Resum:
 *   1) Filtre anti-spam en capes (honeypot, temps mínim, rate-limit per IP,
 *      validació estructural, blocatge de correu temporal, heurística de contingut).
 *   2) Si el missatge supera el filtre:
 *        - es registra un lead en Markdown a /home/pocallum/leads/YYYY-MM/
 *          (directori privat, fora del docroot, no accessible per web);
 *        - s'envia un email a hola@pocallum.cat per notificar-ho.
 *   3) Resposta JSON {ok:true|false} — contracte que espera el wizard natiu.
 *
 * RGPD/LOPDGDD: només es recullen les dades mínimes (nom, email, servei,
 * projecte i els opcionals del formulari) i únicament amb la finalitat de
 * contactar directament amb la persona que demana pressupost. No s'usen per a
 * newsletter ni es cedeixen a tercers. Retenció: 24 mesos.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

const LEADS_ROOT = '/home/pocallum/leads';
const LEAD_ADDRESS = 'hola@pocallum.cat';
const MIN_FILL_SECONDS = 4;
const RATE_LIMIT_PER_WINDOW = 5;
const RATE_WINDOW_SECONDS = 3600;

/*
 * Correus temporals / d'usar i llençar — es descarten de manera silenciosa.
 * (El missatge "s'envia" però no arriba ni s'emmagatzema.)
 */
$DISPOSABLE = [
    '10minutemail.com', 'getnada.com', 'guerrillamail.com', 'maildrop.cc',
    'mailinator.com', 'sharklasers.com', 'tempmail.com', 'temp-mail.org',
    'throwawaymail.com', 'trashmail.com', 'yopmail.com',
];

function e($s)
{
    return trim(strip_tags((string)$s));
}

function h($s)
{
    return str_replace(["\r", "\n", "\0"], '', (string)$s);
}

function reply(int $code, bool $ok)
{
    http_response_code($code);
    echo json_encode(['ok' => $ok], JSON_UNESCAPED_UNICODE);
    exit;
}

/* ─── Capa 1: honeypot ────────────────────────────────────────────────────  */
/* Els bots omplen el camp ocult; els humans no el veuen. Silenciosos.        */
if (($_POST['_gotcha'] ?? '') !== '') {
    reply(200, true);
}

/* ─── Capa 2: temps mínim d'ompliment ───────────────────────────────────── */
/* El wizard injecta _ts (ms) en carregar. Un humà triga >4s a omplir;        */
/* un bot envia en menys de un segon. Silenciosos.                            */
$ts = (int)($_POST['_ts'] ?? 0);
if ($ts <= 0 || (time() - (int)floor($ts / 1000)) < MIN_FILL_SECONDS) {
    reply(200, true);
}

/* ─── Capa 3: rate-limit per IP ─────────────────────────────────────────── */
$ip    = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$cDir  = LEADS_ROOT . '/.control';
@mkdir($cDir, 0770, true);
$rateFile = $cDir . '/rate-' . md5($ip) . '.txt';
$now   = time();
$hits  = [];
if (is_file($rateFile)) {
    $raw = file($rateFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $hits = array_values(array_filter(
        array_map('intval', $raw ?: []),
        function (int $t) use ($now) { return ($now - $t) < RATE_WINDOW_SECONDS; }
    ));
}
if (count($hits) >= RATE_LIMIT_PER_WINDOW) {
    reply(429, false);
}
$hits[] = $now;
$fh = fopen($rateFile, 'c');
if ($fh) {
    flock($fh, LOCK_EX);
    fwrite($fh, implode("\n", $hits) . "\n");
    flock($fh, LOCK_UN);
    fclose($fh);
}

/* ─── Camps del formulari ───────────────────────────────────────────────── */
$nom      = e($_POST['nom'] ?? '');
$email    = e($_POST['email'] ?? '');
$servei   = e($_POST['servei'] ?? '');
$projecte = e($_POST['projecte'] ?? '');
$quan     = e($_POST['quan'] ?? '');
$lloc     = e($_POST['lloc'] ?? '');
$telefon  = e($_POST['telefon'] ?? '');
$via      = e($_POST['via'] ?? '');
$lang     = e($_POST['_language'] ?? 'ca');
$subject  = e($_POST['_subject'] ?? 'Nou pressupost - pocallum.cat');
$consent  = (($_POST['_consent'] ?? '') === '1');

/* ─── Validació estructural (els usuaris reals veuen l'error) ───────────── */
if ($nom === '' || $email === '' || !$consent || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(422, false);
}

/* ─── Capa 4: correu temporal ───────────────────────────────────────────── */
$domain = strtolower((string)substr($email, (int)strrpos($email, '@') + 1));
if (in_array($domain, $DISPOSABLE, true)) {
    reply(200, true);
}

/* ─── Capa 5: heurística de contingut ───────────────────────────────────── */
$urlCount = preg_match_all('#https?://#i', $projecte);
if ($urlCount !== false && $urlCount > 3) {
    reply(200, true);
}
if (strlen($projecte) > 4000) {
    reply(422, false);
}

/* ─── Registre del lead en Markdown ─────────────────────────────────────── */
$fecha    = date('Y-m-d');
$monthDir = LEADS_ROOT . '/' . date('Y-m');
@mkdir($monthDir, 0770, true);
$mdId = date('Ymd-His');
$slug = preg_replace('/[^a-z0-9]+/i', '-', strtolower($nom));

$md  = "---\n";
$md .= "id: " . $mdId . "\n";
$md .= "data: " . date('c') . "\n";
$md .= "estat: nou\n";
$md .= "consentiment: si\n";
$md .= "email: " . $email . "\n";
$md .= "nom: " . $nom . "\n";
$md .= "servei: " . $servei . "\n";
$md .= "via: " . ($via !== '' ? $via : 'web') . "\n";
$md .= "idioma: " . $lang . "\n";
$md .= "---\n\n";
$md .= "## Que li interessa\n\n" . $projecte . "\n";
if ($quan !== '')   { $md .= "\n- **Quan:** " . $quan . "\n"; }
if ($lloc !== '')   { $md .= "- **On:** " . $lloc . "\n"; }
if ($telefon !== ''){ $md .= "- **Telèfon:** " . $telefon . "\n"; }

$leadFile = $monthDir . '/' . $fecha . '-' . $mdId . ($slug ? '-' . $slug : '') . '.md';
@file_put_contents($leadFile, $md, LOCK_EX);

/* ─── Notificació per email ─────────────────────────────────────────────── */
$subject = h(preg_replace('/[\r\n]+/', ' ', $subject));
$to      = LEAD_ADDRESS;

$body = wordwrap(
    "Servei:      " . $servei . "\n" .
    "Projecte:    " . $projecte . "\n" .
    "Quan:        " . $quan . "\n" .
    "On:          " . $lloc . "\n" .
    "Nom:         " . $nom . "\n" .
    "Email:       " . $email . "\n" .
    "Telefon:     " . $telefon . "\n" .
    "Via:         " . ($via !== '' ? $via : 'web') . "\n" .
    "Idioma:      " . $lang . "\n" .
    "Consentiment: sí\n",
    76
);

$headers  = "From: Pocallum <" . $to . ">\r\n";
$headers .= "Reply-To: " . h($nom) . " <" . $email . ">\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = @mail($to, $subject, $body, $headers);

reply($sent ? 200 : 500, $sent);
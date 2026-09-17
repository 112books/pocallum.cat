<?php
/**
 * Missatges — Endpoint privat per consultar els leads del formulari de contacte.
 *
 * Els leads viuen a /home/pocallum/leads/ (tarjeta privada, fora del docroot).
 * Aquest endpoint hi dona accés només amb un token, la demanda del qual es valida
 * contra el SHA-256 guardat a /home/pocallum/leads/.control/.missatges-token-hash
 * (NUNCA el token en clar, i el fitxer no es desplega mai al repo).
 *
 *  GET  /missatges.php?t=…         → llista completa de leads (JSON)
 *  POST /missatges.php (id+estat)  → marca un lead com llegit/fet
 *
 * Auth: Header `Authorization: Bearer <token>` (o ?token=… com a fallback).
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

const LEADS_ROOT = '/home/pocallum/leads';
const TOKEN_HASH_FILE = LEADS_ROOT . '/.control/.missatges-token-hash';
const MAX_ATTEMPTS = 20;

function e($s)
{
    return trim(strip_tags((string)$s));
}

function rj(int $code, bool $ok, array $extra = array())
{
    http_response_code($code);
    $out = array_merge(array('ok' => $ok), $extra);
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
}

/* ─── Rate-limit per IP (protegeix el diccionari sobre el token) ─────────-- */
$ip    = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$cDir  = LEADS_ROOT . '/.control';
@mkdir($cDir, 0770, true);
$rateFile = $cDir . '/rate-msg-' . md5($ip) . '.txt';
$now  = time();
$hits = array();
if (is_file($rateFile)) {
    $raw = file($rateFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $hits = array_values(array_filter(
        array_map('intval', $raw ?: array()),
        function ($t) use ($now) { return ($now - $t) < 3600; }
    ));
}
if (count($hits) >= MAX_ATTEMPTS) {
    rj(429, false);
}
$hits[] = $now;
$fh = fopen($rateFile, 'c');
if ($fh) {
    flock($fh, LOCK_EX);
    fwrite($fh, implode("\n", $hits) . "\n");
    flock($fh, LOCK_UN);
    fclose($fh);
}

/* ─── Auth: el servidor només guarda el SHA-256 del token ────────────────── */
$token = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $auth  = $_SERVER['HTTP_AUTHORIZATION'];
    $token = preg_match('/^Bearer\s+(.+)$/i', $auth, $m) ? trim($m[1]) : '';
}
if ($token === '') {
    $token = e($_GET['token'] ?? '');
}

if (!is_file(TOKEN_HASH_FILE)) {
    rj(503, false, array('error' => 'token no configurat al servidor'));
}
$expected = trim((string)file_get_contents(TOKEN_HASH_FILE));
if (!hash_equals($expected, hash('sha256', $token))) {
    rj(401, false);
}

/* ─── Parser de lead MD (frontmatter + cos) ──────────────────────────────── */
function parseLead(string $file)
{
    $raw = (string)@file_get_contents($file);
    if ($raw === '') {
        return null;
    }
    $meta = array();
    $body = '';
    if (preg_match('/^---\s*\n(.*?)\n---\s*\n(.*)$/s', $raw, $m)) {
        foreach (explode("\n", $m[1]) as $line) {
            if (strpos($line, ':') === false) {
                continue;
            }
            list($k, $v) = explode(':', $line, 2);
            $meta[trim($k)] = trim($v);
        }
        $body = trim($m[2]);
    }
    $meta['_file'] = basename($file);
    $meta['_cos']  = $body;
    return $meta;
}

/* ─── GET: listar leads ──────────────────────────────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $leads = array();
    $dirs  = glob(LEADS_ROOT . '/20[0-9][0-9]-[0-9][0-9]', GLOB_ONLYDIR);
    if ($dirs === false) {
        $dirs = array();
    }
    rsort($dirs);
    foreach ($dirs as $dir) {
        foreach (glob($dir . '/*.md') ?: array() as $file) {
            $lead = parseLead($file);
            if ($lead) {
                $leads[] = $lead;
            }
        }
    }
    usort($leads, function ($a, $b) {
        return strcmp($b['data'] ?? '', $a['data'] ?? '');
    });
    $nous = 0;
    foreach ($leads as $lead) {
        if (($lead['estat'] ?? '') === 'nou') {
            $nous++;
        }
    }
    rj(200, true, array('leads' => $leads, 'nous' => $nous));
}

/* ─── POST: actualitzar estat d'un lead ──────────────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $in  = json_decode((string)file_get_contents('php://input'), true);
    $id  = e($in['id'] ?? '');
    $new = e($in['estat'] ?? '');
    if ($id === '' || !in_array($new, array('llegit', 'fet'), true)) {
        rj(422, false);
    }
    if (!preg_match('/^[0-9]+$/', $id)) {
        rj(422, false);
    }
    $dirs = glob(LEADS_ROOT . '/20[0-9][0-9]-[0-9][0-9]', GLOB_ONLYDIR) ?: array();
    foreach ($dirs as $dir) {
        foreach (glob($dir . '/*.md') ?: array() as $file) {
            if (strpos(basename($file), $id) !== 0) {
                continue;
            }
            $raw = (string)@file_get_contents($file);
            if ($raw === '') {
                continue;
            }
            $upd = preg_replace('/^(estat:\s*).*$/m', '$1' . $new, $raw, 1, $count);
            if ($count > 0 && $upd !== null) {
                @file_put_contents($file, $upd, LOCK_EX);
                rj(200, true);
            }
        }
    }
    rj(404, false);
}

rj(405, false);
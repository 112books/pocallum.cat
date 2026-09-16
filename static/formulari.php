<?php
// Formulari de contacte — enviament via mail() des del mateix hosting (Dinahosting).
// Retorna JSON {"ok":true} per mantenir el contracte que espera el wizard natiu.
header('Content-Type: application/json; charset=utf-8');

function e($s) {
    return trim(strip_tags((string)$s));
}

function h($s) {
    // Sanititza valors que van dins de capçaleres de correu (injecció CRLF).
    return str_replace(["\r", "\n", "\0"], '', (string)$s);
}

$gotcha = isset($_POST['_gotcha']) ? $_POST['_gotcha'] : '';
if ($gotcha !== '') {
    http_response_code(200);
    echo json_encode(['ok' => true]);
    exit;
}

$nom     = e($_POST['nom'] ?? '');
$email   = e($_POST['email'] ?? '');
$servei  = e($_POST['servei'] ?? '');
$projecte= e($_POST['projecte'] ?? '');
$quan    = e($_POST['quan'] ?? '');
$lloc    = e($_POST['lloc'] ?? '');
$telefon = e($_POST['telefon'] ?? '');
$via     = e($_POST['via'] ?? '');
$lang    = e($_POST['_language'] ?? 'ca');
$subject = e($_POST['_subject'] ?? 'Nou pressupost - pocallum.cat');

if ($nom === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false]);
    exit;
}

$subject  = h(preg_replace('/[\r\n]+/', ' ', $subject));
$to       = h('hola@pocallum.cat');

$body = wordwrap(
    "Servei:      $servei\n" .
    "Projecte:    $projecte\n" .
    "Quan:        $quan\n" .
    "On:          $lloc\n" .
    "Nom:         $nom\n" .
    "Email:       $email\n" .
    "Telefon:     $telefon\n" .
    "Via:         $via\n" .
    "Idioma:      $lang\n",
    76
);

$headers  = "From: Pocallum <" . $to . ">\r\n";
$headers .= "Reply-To: " . h($nom) . " <" . h($email) . ">\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    http_response_code(200);
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
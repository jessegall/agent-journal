<?php

declare(strict_types=1);

/*
 * A stand-in journal for the relay tests, run with php -S: it logs each call's body and headers to RELAY_SERVER_LOG
 * and answers like the MCP route would. A notification gets 202, "slow" waits two seconds, "broken" answers 500.
 */
$body = (string) file_get_contents('php://input');
$headers = array_change_key_case(getallheaders(), CASE_LOWER);
file_put_contents(
(string) getenv('RELAY_SERVER_LOG'),
 json_encode(['body' => $body, 'headers' => $headers])."\n",
 FILE_APPEND,
);
$frame = json_decode($body, true);
header('Content-Type: application/json');

if (! isset($frame['id'])) {
    http_response_code(202);

    return;
}

if ($frame['method'] === 'slow') {
    sleep(2);
}

if ($frame['method'] === 'broken') {
    http_response_code(500);
    echo '{"message":"Server Error"}';

    return;
}

$result = $frame['method'] === 'initialize'
    ? ['protocolVersion' => '2025-11-25', 'serverInfo' => ['name' => 'journal', 'version' => '1.0.0']]
    : ['method' => $frame['method'], 'signed' => isset($headers['x-journal-call-signature']), 'protocol' => $headers['mcp-protocol-version'] ?? null];

echo json_encode(['jsonrpc' => '2.0', 'id' => $frame['id'], 'result' => $result]);

<?php

declare(strict_types=1);

/*
 * Freezes the expected structure of every case in tests/Fixtures/Processes/ShellCorpus
 * from independent evidence: the shell-oracle tool, which reads each line with mvdan.cc/sh, never version 6's own
 * parser. Each expected block holds the outcome, the unsupported family when there is one, and the byte span of every
 * command the shell would run. decisions.jsonl entries override the oracle where version 6 intends otherwise. The
 * manifest's fixture hashes and unsupported-family counts are written again. Running it twice gives the same bytes.
 *
 *   go -C tools/shell-oracle build -o bin/shell-oracle . && php tools/processes/freeze-shell-corpus.php
 */

const CORPUS = __DIR__.'/../../tests/Fixtures/Processes/ShellCorpus';
const ORACLE = __DIR__.'/../shell-oracle/bin/shell-oracle';
const ORACLE_EVIDENCE = 'mvdan.cc/sh/v3 v3.14.1 through tools/shell-oracle';

$cases = [];

foreach (file(CORPUS.'/cases.jsonl', FILE_IGNORE_NEW_LINES) ?: fail('cases.jsonl cannot be read') as $line) {
    $case = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
    $cases[$case['id']] = $case;
}

$decisions = [];

foreach (file(CORPUS.'/decisions.jsonl', FILE_IGNORE_NEW_LINES) ?: [] as $line) {
    $decision = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
    $decisions[$decision['case_id']] = $decision;
}

$readings = oracleReadings($cases);
$families = [];

foreach ($cases as $id => $case) {
    $reading = $readings[$id] ?? fail("The oracle gave no reading for {$id}");
    $expected = ['evidence' => ORACLE_EVIDENCE, 'outcome' => $reading['outcome'], 'unsupported' => $reading['unsupported'] ?? null, 'parts' => $reading['parts']];

    if (isset($decisions[$id])) {
        $expected = ['evidence' => 'decisions.jsonl', ...$decisions[$id]['intended_outcome']];
    }

    if ($expected['outcome'] === 'unsupported') {
        $families[$expected['unsupported'] ?? 'unnamed'] = ($families[$expected['unsupported'] ?? 'unnamed'] ?? 0) + 1;
    }
    $cases[$id]['expected'] = $expected;
}
ksort($families);

$casesText = implode('', array_map(fn (array $case): string => json_encode($case, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n", array_values($cases)));
file_put_contents(CORPUS.'/cases.jsonl', $casesText);

$manifest = json_decode((string) file_get_contents(CORPUS.'/manifest.json'), true, 512, JSON_THROW_ON_ERROR);
$manifest['expectations'] = ['evidence' => ORACLE_EVIDENCE, 'decisions' => count($decisions), 'unsupported_family_counts' => $families];

foreach (['cases.jsonl', 'shapes.json', 'decisions.jsonl'] as $name) {
    $manifest['fixtures'][$name] = hash_file('sha256', CORPUS.'/'.$name);
}
file_put_contents(CORPUS.'/manifest.json', json_encode($manifest, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n");

fwrite(STDOUT, count($cases).' cases frozen, '.count($decisions).' decisions applied, unsupported: '.json_encode($families)."\n");

/**
 * @param  array<string, array<string, mixed>>  $cases
 * @return array<string, array{outcome: string, unsupported?: string, parts: list<array{start: int, end: int}>}>
 */
function oracleReadings(array $cases): array
{
    if (! is_executable(ORACLE)) {
        fail('Build the oracle first: go -C tools/shell-oracle build -o bin/shell-oracle .');
    }
    $process = proc_open([ORACLE], [['pipe', 'r'], ['pipe', 'w'], STDERR], $pipes);

    if (! is_resource($process)) {
        fail('The oracle did not start');
    }
    $input = implode('', array_map(fn (array $case): string => json_encode(['id' => $case['id'], 'source' => $case['source'], 'dialect' => $case['dialect']], JSON_THROW_ON_ERROR)."\n", $cases));
    fwrite($pipes[0], $input);
    fclose($pipes[0]);
    $output = stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    if (proc_close($process) !== 0) {
        fail('The oracle failed');
    }
    $readings = [];

    foreach (explode("\n", trim((string) $output)) as $line) {
        $reading = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
        $readings[$reading['id']] = $reading;
    }

    return $readings;
}

function fail(string $message): never
{
    fwrite(STDERR, "freeze-shell-corpus: {$message}\n");
    exit(1);
}

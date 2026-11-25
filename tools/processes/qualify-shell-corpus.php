<?php

declare(strict_types=1);

use App\Enums\Processes\ShellDialect;

require dirname(__DIR__, 2).'/vendor/autoload.php';

/*
 * The full-corpus qualification of version 6's shell syntax. It reads every
 * private corpus source in ../shell-corpus-private (outside the project), deduplicates the lines by source and dialect, splits them into
 * deterministic chunks, and for each chunk compares version 6's reading (tools/processes/analyse-shell-lines.php, run
 * in the app container) with the independent reference (tools/shell-oracle, mvdan.cc/sh). A cursor tied to the input
 * hash lets a killed run resume after its last complete chunk. Private details (sources of differing lines) stay in
 * ../shell-corpus-private/qualification; the public report holds counts, hashes, elapsed time and opaque ids only. Without the corpus
 * or the oracle it reports qualification not run and exits nonzero, never a pass.
 *
 *   php tools/processes/qualify-shell-corpus.php
 */

ini_set('memory_limit', '6G');

const ROOT = __DIR__.'/../..';

// A worker's worktree sits deeper than the project, so it names the corpus and the oracle through the environment.
define('CORPUS', getenv('SHELL_CORPUS') ?: ROOT.'/../shell-corpus-private');
define('ORACLE', getenv('SHELL_ORACLE') ?: ROOT.'/tools/shell-oracle/bin/shell-oracle');
const WORK = CORPUS.'/qualification';
const CHUNK_LINES = 50_000;
const BUDGET_SECONDS = 1_800;
const DECISIONS = __DIR__.'/shell-corpus-decisions.json';

$started = microtime(true);

if (! is_dir(CORPUS) || ! is_executable(ORACLE)) {
    notRun(is_dir(CORPUS) ? 'the reference oracle is not built (go -C tools/shell-oracle build -o bin/shell-oracle .)' : 'the private corpus folder ../shell-corpus-private is missing');
}

if (! is_dir(WORK) && ! mkdir(WORK, 0o700, true)) {
    notRun('the qualification folder cannot be created');
}

[$records, $sources] = corpusRecords();
$inputHash = hash('sha256', implode("\n", array_keys($records)).codeHash());
$chunks = array_chunk(array_values($records), CHUNK_LINES);

$cursorFile = WORK.'/cursor.json';
$cursor = is_file($cursorFile) ? json_decode((string) file_get_contents($cursorFile), true, 512, JSON_THROW_ON_ERROR) : null;

if (($cursor['input'] ?? null) !== $inputHash) {
    $cursor = ['input' => $inputHash, 'done' => [], 'counts' => []];
}

foreach ($chunks as $number => $chunk) {
    if (in_array($number, $cursor['done'], true)) {
        continue;
    }

    if (microtime(true) - $started > BUDGET_SECONDS) {
        fwrite(STDERR, 'The 30-minute budget ran out after chunk '.($number - 1)."; run again to resume.\n");
        break;
    }
    $input = implode('', array_map(fn (array $record) => json_encode($record, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n", $chunk));
    $expected = readings([ORACLE], $input);
    $actual = readings([
        'docker',
        'compose',
        '-p',
        'agent-journal-6',
        'exec',
        '-T',
        // Classification reads the project's stored rules, which the migrated test database holds.
        '-e',
        'APP_ENV=testing',
        '-e',
        'DB_DATABASE=journal_hooks_test',
        'app',
        'php',
        'tools/processes/analyse-shell-lines.php',
    ], $input);

    $counts = ['lines' => count($chunk), 'agree' => 0, 'differ' => 0, 'outcomes' => [], 'explained' => []];
    $differences = [];
    $readings = hash_init('sha256');
    $classifications = hash_init('sha256');

    foreach ($chunk as $record) {
        $want = comparable($expected[$record['id']] ?? [
            'outcome' => 'missing',
            'parts' => [],
        ]);
        $got = comparable($actual[$record['id']] ?? [
            'outcome' => 'missing',
            'parts' => [],
        ]);
        hash_update($readings, $record['id'].json_encode($got, JSON_THROW_ON_ERROR)."\n");
        $classification = $actual[$record['id']]['classification'] ?? null;
        hash_update($classifications, $record['id'].json_encode($classification, JSON_THROW_ON_ERROR)."\n");
        $counts['known'] = ($counts['known'] ?? 0) + (($classification['known'] ?? false) ? 1 : 0);
        $counts['outcomes'][$got['outcome']] = ($counts['outcomes'][$got['outcome']] ?? 0) + 1;

        if ($want === $got) {
            $counts['agree']++;

            continue;
        }
        $counts['differ']++;
        $family = explainedBy($want['outcome'], $got['outcome'], $record['source'], $record['id']);

        if ($family !== null) {
            $counts['explained'][$family] = ($counts['explained'][$family] ?? 0) + 1;
        }
        $differences[] = json_encode([
            'id' => $record['id'],
            'source' => $record['source'],
            'origin' => $record['origin'],
            'reference' => $want,
            'version6' => $got,
            'decision' => $family,
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
    $counts['version6_digest'] = hash_final($readings);
    $counts['classification_digest'] = hash_final($classifications);
    file_put_contents(WORK."/differences-{$number}.jsonl", $differences === [] ? '' : implode("\n", $differences)."\n");
    $cursor['done'][] = $number;
    $cursor['counts'][$number] = $counts;
    file_put_contents($cursorFile, json_encode($cursor, JSON_THROW_ON_ERROR));
    fwrite(STDOUT, sprintf("chunk %d of %d: %d lines, %d differ\n", $number + 1, count($chunks), $counts['lines'], $counts['differ']));
}

$total = ['lines' => 0, 'agree' => 0, 'differ' => 0, 'outcomes' => [], 'explained' => []];
ksort($cursor['counts']);
$total['version6_digest'] = hash('sha256', implode('', array_column($cursor['counts'], 'version6_digest')));
$total['classification_digest'] = hash('sha256', implode('', array_column($cursor['counts'], 'classification_digest')));
$total['known'] = array_sum(array_column($cursor['counts'], 'known'));

foreach ($cursor['counts'] as $counts) {
    foreach ($counts['explained'] ?? [] as $family => $count) {
        $total['explained'][$family] = ($total['explained'][$family] ?? 0) + $count;
    }
    $total['lines'] += $counts['lines'];
    $total['agree'] += $counts['agree'];
    $total['differ'] += $counts['differ'];

    foreach ($counts['outcomes'] as $outcome => $count) {
        $total['outcomes'][$outcome] = ($total['outcomes'][$outcome] ?? 0) + $count;
    }
}
$failingIds = [];

foreach (glob(WORK.'/differences-*.jsonl') ?: [] as $file) {
    foreach (file($file, FILE_IGNORE_NEW_LINES) ?: [] as $line) {
        $difference = json_decode($line, true, 512, JSON_THROW_ON_ERROR);

        if (($difference['decision'] ?? null) === null) {
            $failingIds[] = $difference['id'];
        }
    }
}
sort($failingIds);
$qualification = match (true) {
    count($cursor['done']) !== count($chunks) => 'incomplete',
    $failingIds === [] => 'passed',
    default => 'failed',
};
$report = [
    'qualification' => $qualification,
    'unexplained' => count($failingIds),
    'input_hash' => $inputHash,
    'sources' => $sources,
    'chunks' => ['total' => count($chunks), 'done' => count($cursor['done'])],
    'counts' => $total,
    'elapsed_seconds' => round(microtime(true) - $started, 1),
    'failing_ids' => array_slice($failingIds, 0, 500),
];
file_put_contents(WORK.'/report.json', json_encode($report, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT)."\n");
fwrite(STDOUT, json_encode(array_diff_key($report, ['failing_ids' => true]), JSON_THROW_ON_ERROR)."\n");
exit($report['qualification'] === 'passed' ? 0 : 1);

/**
 * The decision family that explains a difference, or null when none does.
 */
function explainedBy(string $reference, string $version6, string $source, string $id): string|null
{
    static $decisions = null;
    $decisions ??= json_decode((string) file_get_contents(DECISIONS), true, 512, JSON_THROW_ON_ERROR)['decisions'];

    foreach ($decisions as $decision) {
        $matches = isset($decision['ids'])
            ? in_array($id, $decision['ids'], true)
            : $decision['source_pattern'] === '' || preg_match('/'.$decision['source_pattern'].'/', $source) === 1;

        if ($decision['reference'] === $reference && $decision['version6'] === $version6 && $matches) {
            return $decision['family'];
        }
    }

    return null;
}

/**
 * Every line of every corpus source, deduplicated by source and dialect, under an opaque id; empty lines are counted.
 *
 * @return array{array<string, array{id: string, source: string, dialect: string, origin: string}>, array<string, array{lines: int, empty: int}>}
 */
function corpusRecords(): array
{
    $records = [];
    $sources = [];
    $add = function (string $origin, mixed $source, string $dialect = 'bash') use (&$records, &$sources): void {
        $sources[$origin] ??= [
            'lines' => 0,
            'empty' => 0,
        ];
        $sources[$origin]['lines']++;

        if (! is_string($source) || trim($source) === '') {
            $sources[$origin]['empty']++;

            return;
        }
        $id = 'line-'.substr(hash('sha256', $dialect."\0".$source), 0, 20);
        $records[$id] ??= [
            'id' => $id,
            'source' => $source,
            'dialect' => $dialect,
            'origin' => $origin,
        ];
    };

    foreach ([
        'commands.txt',
        'new_commands.jsonl',
        'sessions_commands.txt',
    ] as $name) {
        eachLine(CORPUS."/{$name}", fn (string $line) => $add($name, json_decode($line, true, 512, JSON_THROW_ON_ERROR)));
    }
    eachLine(CORPUS.'/all_commands.txt', fn (string $line) => $add('all_commands.txt', explode("\t", $line, 2)[1] ?? null));
    eachLine(CORPUS.'/github_commands.jsonl', function (string $line) use ($add): void {
        $row = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
        $dialect = ShellDialect::tryFrom($row['shell'] ?? ShellDialect::Bash->value);

        if (in_array($dialect, [
            ShellDialect::Bash,
            ShellDialect::Sh,
        ], true)) {
            $add('github_commands.jsonl', $row['line'] ?? null, $row['shell'] ?? 'bash');
        }
    });
    eachLine(CORPUS.'/session-commands.jsonl', fn (string $line) => $add('session-commands.jsonl', json_decode($line, true, 512, JSON_THROW_ON_ERROR)['source'] ?? null));
    eachLine(CORPUS.'/docker-build-commands.jsonl', fn (string $line) => $add('docker-build-commands.jsonl', json_decode($line, true, 512, JSON_THROW_ON_ERROR)['source'] ?? null));

    foreach (glob(CORPUS.'/helper-report-*.txt') ?: [] as $path) {
        eachLine($path, function (string $written) use ($add): void {
            $line = trim($written);

            if (str_starts_with($line, '"')) {
                $decoded = json_decode($line, true);
                $add('helper-written', is_string($decoded) ? $decoded : null);
            }
        });
    }

    foreach ([
        'v5-project-aliases.json',
        'v6-project-aliases.json',
    ] as $name) {
        foreach (jsonRows(CORPUS."/{$name}") as $row) {
            $add($name, $row['line'] ?? null);
        }
    }

    foreach ([
        'v5-project-command-types.json',
        'v6-project-command-types.json',
    ] as $name) {
        foreach (jsonRows(CORPUS."/{$name}") as $row) {
            $add($name, $row['words'] ?? null);
        }
    }
    ksort($records);

    return [
        $records,
        $sources,
    ];
}

function eachLine(string $path, Closure $read): void
{
    if (! is_file($path)) {
        return;
    }
    $handle = fopen($path, 'r') ?: notRun("{$path} cannot be read");

    while (($line = fgets($handle)) !== false) {
        $line = rtrim($line, "\n");

        if ($line !== '') {
            try {
                $read($line);
            } catch (JsonException $error) {
                notRun(basename($path).' holds a line that is not JSON: '.$error->getMessage());
            }
        }
    }
    fclose($handle);
}

/**
 * @return list<array<string, mixed>>
 */
function jsonRows(string $path): array
{
    if (is_file($path)) {
        return json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR)['rows'] ?? [];
    }

    return [];
}

/**
 * @param  list<string>  $command
 * @return array<string, array<string, mixed>>
 */
function readings(array $command, string $input): array
{
    $process = proc_open($command, [
        [
            'pipe',
            'r',
        ],
        [
            'pipe',
            'w',
        ],
        STDERR,
    ], $pipes, ROOT);

    if (! is_resource($process)) {
        notRun(implode(' ', $command).' did not start');
    }
    stream_set_blocking($pipes[1], false);
    $output = '';
    $offset = 0;

    while ($offset < strlen($input)) {
        $written = @fwrite($pipes[0], substr($input, $offset, 65536));

        if ($written === false) {
            // The reader stopped taking lines: it ended early, so its exit and its error output say why.
            break;
        }
        $offset += $written;
        $output .= (string) stream_get_contents($pipes[1]);
    }
    fclose($pipes[0]);
    stream_set_blocking($pipes[1], true);
    $output .= (string) stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    if (proc_close($process) !== 0) {
        notRun(implode(' ', array_slice($command, 0, 3)).' failed');
    }
    $readings = [];

    foreach (explode("\n", trim($output)) as $line) {
        if ($line === '') {
            continue;
        }

        $reading = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
        $readings[$reading['id']] = $reading;
    }

    return $readings;
}

/**
 * The outcome, and for a complete line its command spans in order: the facts both parsers must agree on.
 *
 * @param  array<string, mixed>  $reading
 * @return array{outcome: string, parts?: list<list<int>>}
 */
function comparable(array $reading): array
{
    $result = ['outcome' => $reading['outcome']];

    if ($reading['outcome'] === 'complete') {
        $parts = array_map(fn (array $span) => [
            $span['start'],
            $span['end'],
        ], $reading['parts']);
        sort($parts);
        $result['parts'] = $parts;
    }

    return $result;
}

function notRun(string $reason): never
{
    fwrite(STDERR, "qualification not run: {$reason}\n");
    exit(2);
}

/**
 * A hash of the analysis code (app/Processes and the analyser), so a cursor from other code never resumes.
 */
function codeHash(): string
{
    $root = __DIR__.'/../..';
    $files = [__DIR__.'/analyse-shell-lines.php'];

    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root.'/app/Processes', FilesystemIterator::SKIP_DOTS)) as $file) {
        $files[] = $file->getPathname();
    }
    sort($files);

    return hash('sha256', implode('', array_map(fn (string $file): string => hash_file('sha256', $file), $files)));
}

<?php

declare(strict_types=1);

/**
 * Runs an installation check against a running journal: it starts real containers and sessions, so it is never part
 * of composer test (README.md).
 *
 *   php tools/installation-checks/run.php protected-session <claude-code|codex> [--skip-renewal] [--reuse-session] [--origin=<url>]
 *       [--email=<owner email>] [--password=<owner password>]
 */

use Tools\InstallationChecks\Containers;
use Tools\InstallationChecks\Journal;
use Tools\InstallationChecks\Outcome;
use Tools\InstallationChecks\ProtectedSessionCheck;

require __DIR__.'/autoload.php';

$checkout = dirname(__DIR__, 2);
$arguments = array_values(array_filter(array_slice($argv, 1), fn (string $argument) => ! str_starts_with($argument, '--')));
$options = [];

foreach (array_slice($argv, 1) as $argument) {
    if (preg_match('/^--([a-z-]+)(?:=(.*))?$/', $argument, $option) === 1) {
        $options[$option[1]] = $option[2] ?? true;
    }
}

[$check, $driver] = [$arguments[0] ?? '', $arguments[1] ?? ''];

if ($check !== 'protected-session' || $driver === '') {
    fwrite(STDERR, "Usage: run.php protected-session <claude-code|codex> [--skip-renewal] [--reuse-session] [--origin=<url>]\n");
    exit(2);
}

$journal = new Journal((string) ($options['origin'] ?? 'http://localhost:54700'));
$containers = new Containers($checkout);
$startedAt = gmdate('Ymd-His');

$sessionCheck = new ProtectedSessionCheck(
    $journal,
    $containers,
    $driver,
    isset($options['skip-renewal']),
    isset($options['reuse-session']),
);

try {
    $journal->signIn((string) ($options['email'] ?? 'owner@journal.local'), (string) ($options['password'] ?? 'password'));
    $outcomes = $sessionCheck->run();
} catch (RuntimeException $stopped) {
    $outcomes = [...$sessionCheck->outcomes(), Outcome::judged('the check ran to its end', false, $stopped->getMessage())];
}

foreach ($outcomes as $outcome) {
    echo $outcome->line(), "\n";
}

$record = "{$checkout}/storage/acceptance/{$check}-{$driver}-{$startedAt}.json";
@mkdir(dirname($record), 0o755, true);
file_put_contents($record, json_encode(
    ['check' => $check, 'driver' => $driver, 'startedAt' => $startedAt, 'outcomes' => array_map(fn (Outcome $outcome) => $outcome->toArray(), $outcomes)],
    JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR,
)."\n");
echo "Written to {$record}\n";

exit(array_all($outcomes, fn (Outcome $outcome) => $outcome->isPassed) ? 0 : 1);

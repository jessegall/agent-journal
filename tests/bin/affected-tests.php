<?php

declare(strict_types=1);

use Tests\Support\AffectedTests;

/*
 * Runs the tests nearest to the changed files, found through the code's syntax trees, up to the most test methods an
 * affected run takes. Without arguments it reads the changes git sees (staged,
 * unstaged and untracked); --since=<commit> reads what changed since that commit; file paths name the changes.
 *
 *   composer test:affected
 *   composer test:affected -- --since=main
 *   composer test:affected -- domain/Rules/src/Commands/ApproveRule/ApproveRuleCommand.php
 */

$root = dirname(__DIR__, 2);

require $root.'/vendor/autoload.php';
require __DIR__.'/test-runs.php';

// The test runs get the shell's environment with APP_ENV testing, so phpunit.xml chooses their database.
$environment = [...getenv(), 'APP_ENV' => 'testing'];

$arguments = array_slice($_SERVER['argv'] ?? [], 1);
$since = null;
$files = [];

foreach ($arguments as $argument) {
    if ($argument === '--none') {
        fwrite(STDOUT, "No file changed, so no test is affected.\n");
        exit(0);
    }

    if (str_starts_with($argument, '--since=')) {
        $since = substr($argument, 8);

        continue;
    }

    $files[] = $argument;
}

if ($files === []) {
    $git = static function (string $command) use ($root): array {
        exec('git -C '.escapeshellarg($root).' '.$command.' 2>/dev/null', $lines, $status);

        if ($status !== 0) {
            fwrite(
                STDERR,
                <<<'TEXT'
                git is not available here: name the changed files, for example composer test:affected -- $(git diff --name-only HEAD).

                TEXT,
            );
            exit(2);
        }

        return $lines;
    };

    $files = $since === null
        ? [...$git('diff --name-only HEAD'), ...$git('ls-files --others --exclude-standard')]
        : $git('diff --name-only '.escapeshellarg($since));
}

$files = array_values(array_unique(array_filter($files)));

if ($files === []) {
    fwrite(STDOUT, "Nothing changed, so no test runs.\n");
    exit(0);
}

$selection = new AffectedTests($root)->for($files);

if ($selection->runFiles() === []) {
    fwrite(STDOUT, "No test reaches the changed code.\n");
    exit(0);
}

fwrite(STDOUT, sprintf(
    "Running the %d test methods nearest the change, in %d files, reached %d steps out; %d reached methods left out."
    ." Every architecture test runs beside them: %d files.\n",
    $selection->methodCount(),
    count($selection->testsByFile),
    $selection->reach,
    $selection->leftOut,
    count($selection->wholeTests),
));

$configuration = configurationFor($root, $selection->runFiles());
$processes = processesFor($root, [], $selection->runFiles());
$heldDatabases = prepareWorkerDatabases($root, $environment, $processes);
$exitCode = (int) run(
    [
        'php',
        'artisan',
        'test',
        '--parallel',
        "--processes={$processes}",
        "--configuration={$configuration}",
        "--filter={$selection->filter()}",
    ],
    $environment,
    $root,
    false,
);
@unlink($configuration);
exit($exitCode);

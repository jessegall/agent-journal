<?php

declare(strict_types=1);

use Tests\Support\AffectedTests;

/*
 * Runs only the tests the changed files can break, found through the code's syntax trees, and refuses a change that
 * reaches more test methods than an affected run takes. Without arguments it reads the changes git sees (staged,
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

if ($selection->isRefused()) {
    fwrite(STDERR, sprintf(
        "The change reaches %d test methods, more than the %d an affected run takes. Name the tests to run instead:\n",
        $selection->methodCount(),
        AffectedTests::MOST_TEST_METHODS,
    ));

    foreach ($selection->testMethodsByFile as $file => $methods) {
        fwrite(STDERR, "  {$file} ({$methods})\n");
    }

    exit(2);
}

if ($selection->testMethodsByFile === []) {
    fwrite(STDOUT, "No test reaches the changed code.\n");
    exit(0);
}

fwrite(STDOUT, sprintf(
    "Running %d test methods in %d files, reached %d steps out from the changed classes.\n",
    $selection->methodCount(),
    count($selection->testMethodsByFile),
    $selection->reach,
));

$configuration = configurationFor($root, $selection->testFiles());
$processes = processesFor($root, [], $selection->testFiles());
$heldDatabases = prepareWorkerDatabases($root, $environment, $processes);
$exitCode = (int) run(
    ['php', 'artisan', 'test', '--parallel', "--processes={$processes}", "--configuration={$configuration}"],
    $environment,
    $root,
    false,
);
@unlink($configuration);
exit($exitCode);

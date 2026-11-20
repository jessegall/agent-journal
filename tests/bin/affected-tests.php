<?php

declare(strict_types=1);

use App\Domains\Support\DomainRegistry;
use Illuminate\Contracts\Console\Kernel;
use Tests\Support\AffectedTests;

/*
 * Runs only the tests the changed files can break. Without arguments it reads the changes git sees (staged, unstaged
 * and untracked); --since=<commit> reads what changed since that commit; file paths name the changes themselves.
 *
 *   composer test:affected
 *   composer test:affected -- --since=main
 *   composer test:affected -- domain/Rules/src/Commands/ApproveRule.php
 */

$root = dirname(__DIR__, 2);

require $root.'/vendor/autoload.php';
require __DIR__.'/test-runs.php';

// The test runs get the environment as it was before the app loaded .env, so phpunit.xml chooses their database.
$environment = [...getenv(), 'APP_ENV' => 'testing'];

$app = require $root.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

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

$folders = new AffectedTests($app->make(DomainRegistry::class), $root)->for($files);

$configuration = configurationFor($root, $folders);
$listed = explode(
    "\n",
    run(['php', 'artisan', 'test', '--list-tests', "--configuration={$configuration}"], $environment, $root, true),
);
$count = count(array_filter($listed, fn (string $line) => str_starts_with($line, ' - ')));

fwrite(STDOUT, $folders === AffectedTests::EVERYTHING
    ? "Running {$count} tests: a change outside every domain, so every test runs.\n"
    : "Running {$count} tests of: ".implode(', ', $folders)."\n");

$exitCode = (int) run(
    ['php', 'artisan', 'test', '--parallel', '--recreate-databases', "--configuration={$configuration}"],
    $environment,
    $root,
    false,
);
@unlink($configuration);
dropRunDatabase($root);
exit($exitCode);

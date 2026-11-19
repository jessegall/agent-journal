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
                "git is not available here: name the changed files, for example composer test:affected -- \$(git diff --name-only HEAD).\n",
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
exit($exitCode);

/**
 * Runs a command in the given environment: its output answered when kept, otherwise shown as it comes and its exit
 * code answered.
 *
 * @param  list<string>  $command
 * @param  array<string, string>  $environment
 */
function run(array $command, array $environment, string $root, bool $keepOutput): string
{
    $streams = $keepOutput ? [1 => ['pipe', 'w'], 2 => STDERR] : [1 => STDOUT, 2 => STDERR];
    $process = proc_open($command, $streams, $pipes, $root, $environment);

    if (! is_resource($process)) {
        fwrite(STDERR, 'Could not start: '.implode(' ', $command)."\n");
        exit(2);
    }

    $output = $keepOutput ? (string) stream_get_contents($pipes[1]) : '';
    $exitCode = proc_close($process);

    return $keepOutput ? $output : (string) $exitCode;
}

/**
 * The project's phpunit.xml with one test suite of the chosen folders, so ParaTest runs them in parallel as it runs
 * the whole suite; every folder is written in full, since the copy lies outside the project.
 *
 * @param  list<string>  $folders
 */
function configurationFor(string $root, array $folders): string
{
    $configuration = (string) file_get_contents("{$root}/phpunit.xml");

    if ($folders !== AffectedTests::EVERYTHING) {
        $directories = implode(
            '',
            array_map(fn (string $folder) => "            <directory>{$root}/{$folder}</directory>\n", $folders),
        );
        $configuration = (string) preg_replace(
            '#<testsuites>.*</testsuites>#s',
            "<testsuites>\n        <testsuite name=\"Affected\">\n{$directories}        </testsuite>\n    </testsuites>",
            $configuration,
        );
    }

    $configuration = str_replace(
        [
            '"vendor/',
            '"tests/bootstrap.php"',
            '<directory>app</directory>',
            '<directory>domain</directory>',
            '<directory>tests/',
        ],
        [
            "\"{$root}/vendor/",
            "\"{$root}/tests/bootstrap.php\"",
            "<directory>{$root}/app</directory>",
            "<directory>{$root}/domain</directory>",
            "<directory>{$root}/tests/",
        ],
        $configuration,
    );
    $configuration = str_replace('<directory>domain/', "<directory>{$root}/domain/", $configuration);
    $path = tempnam(sys_get_temp_dir(), 'affected-phpunit-').'.xml';
    file_put_contents($path, $configuration);

    return $path;
}

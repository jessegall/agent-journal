<?php

declare(strict_types=1);

use Tests\Support\AffectedTests;

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
 * The project's phpunit.xml with one test suite of the chosen folders and test files, so ParaTest runs them in
 * parallel as it runs the whole suite; every path is written in full, since the copy lies outside the project.
 *
 * @param  list<string>  $paths
 */
function configurationFor(string $root, array $paths): string
{
    $configuration = (string) file_get_contents("{$root}/phpunit.xml");

    if ($paths !== AffectedTests::EVERYTHING) {
        $directories = implode(
            '',
            array_map(fn (string $path) => is_file("{$root}/{$path}")
                ? "            <file>{$root}/{$path}</file>\n"
                : "            <directory>{$root}/{$path}</directory>\n", $paths),
        );
        $configuration = (string) preg_replace(
            '#<testsuites>.*</testsuites>#s',
            <<<TEXT
            <testsuites>
                    <testsuite name="Affected">
            {$directories}        </testsuite>
                </testsuites>
            TEXT,
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

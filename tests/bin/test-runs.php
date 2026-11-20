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

/**
 * Drops a run's own database and the copies a parallel run made of it, when the run was given one to drop; the
 * shared test databases are never dropped.
 */
function dropRunDatabase(string $root): void
{
    $database = (string) getenv('DB_DATABASE');
    $isRunDatabase = preg_match('/^journal_hooks_test_wt_[a-z0-9]+$/', $database) === 1;

    if (getenv('JOURNAL_DROP_RUN_DATABASE') !== '1' || ! $isRunDatabase) {
        return;
    }

    $server = testServer($root);
    $names = $server->prepare('select datname from pg_database where datname = ? or datname ~ ?');
    $names->execute([$database, sprintf('^%s_test_[0-9]+$', $database)]);

    foreach ($names->fetchAll(PDO::FETCH_COLUMN) as $name) {
        $server->exec(sprintf('drop database if exists "%s" with (force)', $name));
    }
}

/**
 * Makes each parallel worker's database a copy of one migrated template, so a run migrates nothing while no migration
 * changed: the template is rebuilt once when the migration fingerprint differs, and every worker database is dropped
 * and copied from it, stamped with the fingerprint the tests compare.
 *
 * @param  array<string, string>  $environment
 * @param  list<string>  $options  the run's options, which may name its --processes
 */
function prepareWorkerDatabases(string $root, array $environment, array $options): void
{
    $named = (string) getenv('DB_DATABASE');
    $database = str_starts_with($named, 'journal_hooks_test') ? $named : 'journal_hooks_test';
    $template = "{$database}_template";
    $fingerprint = run(['php', 'tests/bin/migration-fingerprint.php'], $environment, $root, true);
    $server = testServer($root);
    $stored = $server->prepare(
        "select shobj_description(oid, 'pg_database') from pg_database where datname = ?",
    );
    $stored->execute([$template]);

    if ($stored->fetchColumn() !== $fingerprint) {
        $server->exec(sprintf('drop database if exists "%s" with (force)', $template));
        $server->exec(sprintf('create database "%s"', $template));
        run(
            ['php', 'artisan', 'migrate:fresh', '--force'],
            [...$environment, 'DB_DATABASE' => $template],
            $root,
            true,
        );
        $server->exec(sprintf('comment on database "%s" is %s', $template, $server->quote($fingerprint)));
    }

    foreach (range(1, processesOf($options)) as $token) {
        $worker = "{$database}_test_{$token}";
        $server->exec(sprintf('drop database if exists "%s" with (force)', $worker));
        $server->exec(sprintf('create database "%s" template "%s"', $worker, $template));
        $server->exec(sprintf('comment on database "%s" is %s', $worker, $server->quote($fingerprint)));
    }
}

/**
 * How many workers the run starts: its --processes, or one per CPU as ParaTest does.
 *
 * @param  list<string>  $options
 */
function processesOf(array $options): int
{
    foreach ($options as $option) {
        if (preg_match('/^--processes=(\d+)$/', $option, $count) === 1) {
            return max(1, (int) $count[1]);
        }
    }

    return max(1, (int) trim((string) shell_exec('nproc')));
}

/**
 * A connection to the test Postgres server itself, outside any test database.
 */
function testServer(string $root): PDO
{
    $settings = Dotenv\Dotenv::parse((string) file_get_contents("{$root}/.env"));

    return new PDO(
        sprintf('pgsql:host=%s;port=%s;dbname=postgres', $settings['DB_HOST'], $settings['DB_PORT']),
        $settings['DB_USERNAME'],
        $settings['DB_PASSWORD'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION],
    );
}

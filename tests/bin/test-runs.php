<?php

declare(strict_types=1);

use Tests\Support\AffectedTests;

require_once __DIR__.'/worktree-databases.php';

// The workers a run starts when its --processes names none: room is left for the containers beside it.
const DEFAULT_PROCESSES = 4;

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
 * Makes each parallel worker's database a copy of one migrated template, so a run migrates nothing while no migration
 * changed: the template is rebuilt once when the migration fingerprint differs, and every worker database is dropped
 * and copied from it, stamped with the fingerprint the tests compare. The answered connection holds the run's
 * databases until the run ends, and the databases of removed worktrees are dropped first.
 *
 * @param  array<string, string>  $environment
 */
function prepareWorkerDatabases(string $root, array $environment, int $processes): PDO
{
    $named = (string) getenv('DB_DATABASE');
    $database = str_starts_with($named, 'journal_hooks_test') ? $named : 'journal_hooks_test';
    $template = "{$database}_template";
    $server = holdRunDatabases($root, $database);
    dropDatabasesOfRemovedWorktrees($server, $root, $database);
    $fingerprint = run(['php', 'tests/bin/migration-fingerprint.php'], $environment, $root, true);
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

    foreach (range(1, $processes) as $token) {
        $worker = "{$database}_test_{$token}";
        $server->exec(sprintf('drop database if exists "%s" with (force)', $worker));
        $server->exec(sprintf('create database "%s" template "%s"', $worker, $template));
        $server->exec(sprintf('comment on database "%s" is %s', $worker, $server->quote($fingerprint)));
    }

    return $server;
}

/**
 * Holds the run's databases until its connection closes: a second run of the same checkout waits here until the first
 * ends, since both use the same databases. The holding connection probes its client every few seconds, so a run that
 * was stopped without closing it lets go of the lock within half a minute instead of holding it for good.
 */
function holdRunDatabases(string $root, string $database): PDO
{
    $server = testServer($root);
    $server->exec('set tcp_keepalives_idle = 10');
    $server->exec('set tcp_keepalives_interval = 5');
    $server->exec('set tcp_keepalives_count = 3');
    $server->prepare('select pg_advisory_lock(hashtext(?))')->execute([$database]);

    return $server;
}

/**
 * Drops the test databases of worktrees whose folder is gone, never the running one's, the main checkout's or the
 * shared ones; a worktree whose run holds its databases is left for a later run.
 */
function dropDatabasesOfRemovedWorktrees(PDO $server, string $root, string $running): void
{
    $marker = strpos($root, '/.journal/worktrees/');
    $project = $marker === false ? $root : substr($root, 0, $marker);
    $kept = array_map(
        fn (string $folder) => worktreeDatabaseOf(basename($folder)),
        glob("{$project}/.journal/worktrees/*/*", GLOB_ONLYDIR) ?: [],
    );
    $kept[] = worktreeDatabaseOf('main');
    $kept[] = $running;
    $pattern = '^journal_hooks_test_wt_[a-z0-9]+(_template|_test_[0-9]+)?$';
    $names = $server->prepare('select datname from pg_database where datname ~ ?');
    $names->execute([$pattern]);
    $removed = [];

    foreach ($names->fetchAll(PDO::FETCH_COLUMN) as $name) {
        $base = (string) preg_replace('/(_template|_test_[0-9]+)$/', '', (string) $name);

        if (! in_array($base, $kept, true)) {
            $removed[$base][] = (string) $name;
        }
    }

    foreach ($removed as $base => $databases) {
        $held = $server->prepare('select pg_try_advisory_lock(hashtext(?))');
        $held->execute([$base]);

        if ($held->fetchColumn() !== true) {
            continue;
        }

        foreach ($databases as $name) {
            $server->exec(sprintf('drop database if exists "%s" with (force)', $name));
        }

        $server->prepare('select pg_advisory_unlock(hashtext(?))')->execute([$base]);
    }
}

/**
 * How many workers a run of these paths starts: its --processes, else at most four, and never more than the test
 * files it runs, since each worker gets a database copy of its own.
 *
 * @param  list<string>  $options
 * @param  list<string>  $paths  the run's folders and test files; none runs every test
 */
function processesFor(string $root, array $options, array $paths): int
{
    foreach ($options as $option) {
        if (preg_match('/^--processes=(\\d+)$/', $option, $count) === 1) {
            return max(1, (int) $count[1]);
        }
    }

    if ($paths === [] || $paths === AffectedTests::EVERYTHING) {
        return DEFAULT_PROCESSES;
    }

    return max(1, min(DEFAULT_PROCESSES, testFileCount($root, $paths)));
}

/**
 * @param  list<string>  $paths
 */
function testFileCount(string $root, array $paths): int
{
    $count = 0;

    foreach ($paths as $path) {
        if (is_file("{$root}/{$path}")) {
            $count++;

            continue;
        }

        $folder = new RecursiveDirectoryIterator("{$root}/{$path}", FilesystemIterator::SKIP_DOTS);

        foreach (new RecursiveIteratorIterator($folder) as $file) {
            $count += str_ends_with($file->getFilename(), 'Test.php') ? 1 : 0;
        }
    }

    return $count;
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

<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\DatabaseManager;
use Illuminate\Testing\ParallelTesting;

/**
 * Checks that a test runs on a dedicated Postgres test database, or on the worker's own copy of it in a parallel run,
 * never the application database. There are two: journal_hooks_test, which phpunit.xml selects, and
 * journal_hooks_test_checkpoint, which the journal's own runs select with DB_DATABASE so they never recreate the
 * worker databases of a run going on at the same time. scripts/prepare-hook-test-database.sh creates both.
 */
final class HookDatabase
{
    public const string NAME = 'journal_hooks_test';

    public const string CHECKPOINT_NAME = 'journal_hooks_test_checkpoint';

    /**
     * @var list<string>
     */
    private const array BASE_NAMES = [self::NAME, self::CHECKPOINT_NAME];

    private const string BASE_CHECK_CONNECTION = 'hook_database_base_check';

    public static function select(Application $app): void
    {
        if (! $app->environment('testing')) {
            throw HookDatabaseRefused::outsideTesting();
        }

        $selected = $app->make(DatabaseManager::class)->connection()->getDatabaseName();
        $expected = self::expectedName($app);

        if ($selected === $expected) {
            return;
        }

        if (self::isParallelWorker($app) && in_array($selected, self::BASE_NAMES, true)) {
            throw HookDatabaseRefused::baseDatabaseInWorker($selected, $expected);
        }

        throw HookDatabaseRefused::otherDatabase($selected, $expected);
    }

    /**
     * Refuses a parallel run whose base database is not one of the two test databases or does not exist, before Laravel
     * copies it.
     */
    public static function checkBase(Application $app): void
    {
        if (! $app->environment('testing')) {
            throw HookDatabaseRefused::outsideTesting();
        }

        $database = $app->make(DatabaseManager::class);
        $selected = $database->connection()->getDatabaseName();

        if (! in_array($selected, self::BASE_NAMES, true)) {
            throw HookDatabaseRefused::otherDatabase($selected, self::NAME);
        }

        $server = $database->connectUsing(
            self::BASE_CHECK_CONNECTION,
            [...$database->connection()->getConfig(), 'database' => 'postgres'],
        );
        $exists = $server->table('pg_database')->where('datname', $selected)->exists();
        $database->purge(self::BASE_CHECK_CONNECTION);

        if (! $exists) {
            throw HookDatabaseRefused::baseDatabaseMissing($selected);
        }
    }

    /**
     * Whether this process is a worker of a parallel run, which Laravel gives its own copy of the test database.
     */
    public static function isParallelWorker(Application $app): bool
    {
        return $app->make(ParallelTesting::class)->token() !== false;
    }

    /**
     * The database this process must run on: the base name serially, the base name with the worker's token in a worker.
     */
    public static function expectedName(Application $app): string
    {
        $base = self::baseNameOf($app->make(DatabaseManager::class)->connection()->getDatabaseName());
        $token = $app->make(ParallelTesting::class)->token();

        if ($token === false) {
            return $base;
        }

        return $base.'_test_'.$token;
    }

    /**
     * The test database the selected one is, or was copied from for a worker; journal_hooks_test when it is neither.
     */
    private static function baseNameOf(string $selected): string
    {
        $base = (string) preg_replace('/_test_[0-9]+$/', '', $selected);

        return in_array($base, self::BASE_NAMES, true) ? $base : self::NAME;
    }
}

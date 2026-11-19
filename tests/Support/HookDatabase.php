<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\DatabaseManager;
use Illuminate\Testing\ParallelTesting;
use Tests\Support\Exceptions\HookDatabaseRefused;

/**
 * Checks that a test runs on a dedicated Postgres test database, or on the worker's own copy of it in a parallel run,
 * never the application database. journal_hooks_test is the one phpunit.xml selects; journal_hooks_test_checkpoint is
 * the journal's own checkpoint runs'; and journal_hooks_test_wt_<name> is one worktree's, selected with DB_DATABASE so
 * runs in different worktrees never touch each other's rows. scripts/prepare-hook-test-database.sh creates the first
 * two; a worktree's database is created on its first run.
 */
final class HookDatabase
{
    public const string NAME = 'journal_hooks_test';

    public const string CHECKPOINT_NAME = 'journal_hooks_test_checkpoint';

    /**
     * @var list<string>
     */
    private const array BASE_NAMES = [self::NAME, self::CHECKPOINT_NAME];

    private const string WORKTREE_BASE_PATTERN = '/^journal_hooks_test_wt_[a-z0-9]+$/';

    private const string BASE_CHECK_CONNECTION = 'hook_database_base_check';

    /**
     * The worktree databases this process has already made sure exist.
     *
     * @var list<string>
     */
    private static array $worktreeBasesSeen = [];

    public static function select(Application $app): void
    {
        if (! $app->environment('testing')) {
            throw HookDatabaseRefused::outsideTesting();
        }

        $selected = $app->make(DatabaseManager::class)->connection()->getDatabaseName();
        $expected = self::expectedName($app);

        if ($selected === $expected) {
            self::createWorktreeBaseOnce($app, $selected);

            return;
        }

        if (self::isParallelWorker($app) && self::isBaseName($selected)) {
            throw HookDatabaseRefused::baseDatabaseInWorker($selected, $expected);
        }

        throw HookDatabaseRefused::otherDatabase($selected, $expected);
    }

    /**
     * Refuses a run whose base database is not a test database, before Laravel copies it, and creates a worktree's own
     * test database on its first run; a missing shared one is refused, since its script also prepares it.
     */
    public static function checkBase(Application $app): void
    {
        if (! $app->environment('testing')) {
            throw HookDatabaseRefused::outsideTesting();
        }

        $database = $app->make(DatabaseManager::class);
        $selected = $database->connection()->getDatabaseName();

        if (! self::isBaseName($selected)) {
            throw HookDatabaseRefused::otherDatabase($selected, self::NAME);
        }

        $server = $database->connectUsing(
            self::BASE_CHECK_CONNECTION,
            [...$database->connection()->getConfig(), 'database' => 'postgres'],
        );
        $exists = $server->table('pg_database')->where('datname', $selected)->exists();

        if (! $exists && self::isWorktreeBase($selected)) {
            $server->statement("CREATE DATABASE \"{$selected}\"");
            $exists = true;
        }

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

        return self::isBaseName($base) ? $base : self::NAME;
    }

    /**
     * Creates a worktree's own test database the first time this process runs on it; the shared ones and parallel
     * copies are left to their script and to Laravel.
     */
    private static function createWorktreeBaseOnce(Application $app, string $name): void
    {
        if (! self::isWorktreeBase($name) || in_array($name, self::$worktreeBasesSeen, true)) {
            return;
        }

        $database = $app->make(DatabaseManager::class);
        $server = $database->connectUsing(
            self::BASE_CHECK_CONNECTION,
            [...$database->connection()->getConfig(), 'database' => 'postgres'],
        );

        if (! $server->table('pg_database')->where('datname', $name)->exists()) {
            $server->statement("CREATE DATABASE \"{$name}\"");
        }

        $database->purge(self::BASE_CHECK_CONNECTION);
        self::$worktreeBasesSeen[] = $name;
    }

    /**
     * Whether the name is a test database a run may start from: a shared one, or a worktree's own.
     */
    private static function isBaseName(string $name): bool
    {
        return in_array($name, self::BASE_NAMES, true) || self::isWorktreeBase($name);
    }

    /**
     * Whether the name is one worktree's own test database, journal_hooks_test_wt_ followed by its plain name.
     */
    private static function isWorktreeBase(string $name): bool
    {
        return preg_match(self::WORKTREE_BASE_PATTERN, $name) === 1;
    }
}

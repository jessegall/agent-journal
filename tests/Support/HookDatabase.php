<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\DatabaseManager;
use Illuminate\Testing\ParallelTesting;

/**
 * Checks that a test runs on the dedicated Postgres test database journal_hooks_test that phpunit.xml selects, or on
 * the worker's own copy of it in a parallel run, never the application database; scripts/prepare-hook-test-database.sh
 * creates it.
 */
final class HookDatabase
{
    public const string NAME = 'journal_hooks_test';

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

        if (self::isParallelWorker($app) && $selected === self::NAME) {
            throw HookDatabaseRefused::baseDatabaseInWorker($selected, $expected);
        }

        throw HookDatabaseRefused::otherDatabase($selected, $expected);
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
        $token = $app->make(ParallelTesting::class)->token();

        if ($token === false) {
            return self::NAME;
        }

        return self::NAME.'_test_'.$token;
    }
}

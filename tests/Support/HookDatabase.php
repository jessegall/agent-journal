<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\DatabaseManager;

/**
 * Checks that a test runs on the dedicated Postgres test database journal_hooks_test that phpunit.xml selects, never
 * the application database; scripts/prepare-hook-test-database.sh creates it.
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

        if ($selected !== self::NAME) {
            throw HookDatabaseRefused::otherDatabase($selected);
        }
    }
}

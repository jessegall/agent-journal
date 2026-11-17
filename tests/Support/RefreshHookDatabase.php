<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\RefreshDatabaseState;

/**
 * Refreshes the dedicated Postgres database journal_hooks_test for a test. Laravel keeps one "migrated" flag for every
 * database, so this keeps its own flag for the hook database and gives the SQLite tests theirs back afterwards.
 */
trait RefreshHookDatabase
{
    use RefreshDatabase;

    private static bool $hookDatabaseMigrated = false;

    private static bool $otherDatabaseMigrated = false;

    protected function beforeRefreshingDatabase(): void
    {
        HookDatabase::select($this->app);

        self::$otherDatabaseMigrated = RefreshDatabaseState::$migrated;
        RefreshDatabaseState::$migrated = self::$hookDatabaseMigrated;
    }

    protected function afterRefreshingDatabase(): void
    {
        self::$hookDatabaseMigrated = RefreshDatabaseState::$migrated;
        RefreshDatabaseState::$migrated = self::$otherDatabaseMigrated;
    }
}

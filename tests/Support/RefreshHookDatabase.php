<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\DatabaseManager;

/**
 * Runs a test on the dedicated Postgres database journal_hooks_test: selects it, runs any pending migration, and wraps
 * the test in a transaction that is rolled back, unless the test commits real rows and names no connection to wrap.
 * It keeps nothing between tests, so it never shares Laravel's own "migrated" flag with the SQLite tests.
 */
trait RefreshHookDatabase
{
    private bool $hookDatabaseIsReady = false;

    protected function setUpRefreshHookDatabase(): void
    {
        if ($this->hookDatabaseIsReady) {
            return;
        }

        HookDatabase::select($this->app);
        $this->app->make(Kernel::class)->call('migrate', ['--force' => true]);
        $this->hookDatabaseIsReady = true;

        foreach ($this->connectionsToTransact() as $name) {
            $connection = $this->app->make(DatabaseManager::class)->connection($name);
            $connection->beginTransaction();
            $this->beforeApplicationDestroyed(fn () => $connection->rollBack());
        }
    }

    /**
     * The connections whose work is rolled back after each test; the default connection unless a test commits.
     *
     * @return list<string|null>
     */
    protected function connectionsToTransact(): array
    {
        return [null];
    }

    protected function emptyTables(string ...$tables): void
    {
        $database = $this->app->make(DatabaseManager::class);

        foreach ($tables as $table) {
            $database->table($table)->truncate();
        }
    }
}

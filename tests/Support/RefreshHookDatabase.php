<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\Connection;
use Illuminate\Database\DatabaseManager;
use Illuminate\Foundation\Testing\DatabaseTransactionsManager;

/**
 * Runs a test on the dedicated Postgres database journal_hooks_test: selects it, runs any pending migration, and wraps
 * the test in a transaction that is rolled back, unless the test commits real rows and names no connection to wrap.
 * As in Laravel's own test transactions, work done after a commit runs when the test's inner transaction commits.
 * It keeps nothing between tests.
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

        $connections = array_map(
            fn (?string $name) => $this->app->make(DatabaseManager::class)->connection($name),
            $this->connectionsToTransact(),
        );
        $transactions = new DatabaseTransactionsManager(array_map(fn (Connection $connection) => $connection->getName(), $connections));
        $this->app->instance('db.transactions', $transactions);

        foreach ($connections as $connection) {
            $connection->setTransactionManager($transactions);
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

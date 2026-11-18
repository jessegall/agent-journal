<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\DatabaseManager;
use Illuminate\Foundation\Testing\DatabaseTransactions;

/**
 * Runs a test on the dedicated Postgres hook database through Laravel's DatabaseTransactions: checks the selected
 * database with HookDatabase, migrates it in a serial run, and wraps the test in a transaction that is rolled back,
 * unless the test commits real rows and names no connection to wrap. In a parallel run Tests\CreatesApplication first
 * checks the base database, then Laravel creates, switches to and migrates the worker's own database before this
 * check runs. Work done after a commit runs when the test's inner transaction commits.
 */
trait RefreshHookDatabase
{
    use DatabaseTransactions {
        beginDatabaseTransaction as beginLaravelDatabaseTransaction;
    }

    public function beginDatabaseTransaction(): void
    {
        HookDatabase::select($this->app);

        if (! HookDatabase::isParallelWorker($this->app)) {
            $this->app->make(Kernel::class)->call('migrate', ['--force' => true]);
        }

        // A test that commits real rows wraps nothing, so it keeps Laravel's own transaction manager: the testing one
        // takes the first transaction for the wrapper and would run after-commit work even when it rolls back.
        if ($this->connectionsToTransact() === []) {
            return;
        }

        $this->beginLaravelDatabaseTransaction();

        // The wrapper stands in for a bus transaction, so a command a request runs (such as a heartbeat) may join it.
        $connection = $this->app->make(DatabaseManager::class)->connection();
        $connection->statement("SET LOCAL lock_timeout = '5000ms'");
        $connection->statement("SET LOCAL statement_timeout = '30000ms'");
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

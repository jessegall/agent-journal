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

    /**
     * The database whose migrations this process already compared with its fingerprint.
     */
    private static string|null $checkedDatabase = null;

    public function beginDatabaseTransaction(): void
    {
        HookDatabase::select($this->app);
        $this->rebuildWhenMigrationsChanged();

        // A test's commits need not wait for the disk: what a test writes is thrown away, and the setting holds for
        // this session only, so the app's own database stays durable.
        $this->app->make(DatabaseManager::class)->connection()->statement('SET synchronous_commit = off');

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
     * A create migration is edited in place, so a database kept from an earlier run can hold old tables that
     * migrate never touches. The database keeps a fingerprint of the migration files it was built from; once per
     * process a differing fingerprint rebuilds it with migrate:fresh. A parallel worker's database is made new for
     * every run and Laravel has just migrated it, so one with no fingerprint yet is only stamped, not built again.
     */
    private function rebuildWhenMigrationsChanged(): void
    {
        $connection = $this->app->make(DatabaseManager::class)->connection();
        $database = $connection->getDatabaseName();

        if (self::$checkedDatabase === $database) {
            return;
        }

        $fingerprint = HookDatabase::migrationFingerprint($this->app);
        $stored = $connection->scalar(
            "select shobj_description(oid, 'pg_database') from pg_database where datname = current_database()",
        );

        $isFreshWorker = $stored === null && HookDatabase::isParallelWorker($this->app);

        if ($stored !== $fingerprint && ! $isFreshWorker) {
            $this->app->make(Kernel::class)->call('migrate:fresh', ['--force' => true]);
        }

        if ($stored !== $fingerprint) {
            $connection->statement(sprintf('comment on database "%s" is \'%s\'', $database, $fingerprint));
        }

        self::$checkedDatabase = $database;
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

    /**
     * Empties the tables a test committed rows to, in one statement, and starts their sequences again, as some tests
     * read the first id a table hands out.
     */
    protected function emptyTables(string ...$tables): void
    {
        if ($tables === []) {
            return;
        }

        $quoted = implode(', ', array_map(fn (string $table) => '"'.$table.'"', $tables));
        $this->app->make(DatabaseManager::class)->connection()->statement("truncate table {$quoted} restart identity cascade");
    }
}

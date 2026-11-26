<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\DatabaseManager;
use Illuminate\Foundation\Testing\DatabaseTransactions;

/**
 * Runs a test on the dedicated Postgres hook database through Laravel's DatabaseTransactions: it checks the database,
 * migrates it in a serial run and wraps the test in a rolled-back transaction, unless the test commits real rows. A
 * parallel worker's own database is made and migrated by Laravel first.
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

        // Built-in profiles hold the grants of the domains booted at their install, so each test installs its own.
        $this->emptyTables('profiles');

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
     * Rebuilds a kept database with migrate:fresh once per process when the fingerprint of the migration files it was
     * built from differs, since a create migration is edited in place. A parallel worker's database, just migrated, is
     * only stamped.
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
     * The tables of the test database that hold a row now, read in one statement.
     *
     * @return list<string>
     */
    protected function tablesHoldingRows(): array
    {
        $connection = $this->app->make(DatabaseManager::class)->connection();
        $tables = array_map(
            fn (object $table) => (string) $table->tablename,
            $connection->select("select tablename from pg_tables where schemaname = current_schema() and tablename <> 'migrations'"),
        );
        $checks = array_map(fn (string $table) => "select '{$table}' as name where exists (select 1 from \"{$table}\")", $tables);

        return $checks === [] ? [] : array_map(
            fn (object $holding) => (string) $holding->name,
            $connection->select(implode(' union all ', $checks)),
        );
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

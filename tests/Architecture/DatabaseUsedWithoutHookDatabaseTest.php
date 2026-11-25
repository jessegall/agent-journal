<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Illuminate\Database\DatabaseManager;
use PDO;
use Tests\Support\Exceptions\DatabaseUsedWithoutHookDatabase;
use Tests\TestCase;

/**
 * A test class without RefreshHookDatabase is stopped by name before its query reaches the database.
 */
final class DatabaseUsedWithoutHookDatabaseTest extends TestCase
{
    public function test_a_read_is_refused_by_name_before_it_runs(): void
    {
        $connection = $this->app->make(DatabaseManager::class)->connection();
        $connection->enableQueryLog();

        $this->assertSame(
            DatabaseUsedWithoutHookDatabase::by(self::class)->getMessage(),
            $this->refusalOf(fn () => $connection->table('users')->count())->getMessage(),
        );
        $this->assertSame([], $connection->getQueryLog());
    }

    public function test_a_write_is_refused_before_it_runs_and_leaves_the_row_unchanged(): void
    {
        $connection = $this->app->make(DatabaseManager::class)->connection();
        $pdo = $connection->getPdo();
        $pdo->exec('CREATE TEMPORARY TABLE refused_write_sentinel (value integer)');
        $pdo->exec('INSERT INTO refused_write_sentinel VALUES (1)');

        $refusal = $this->refusalOf(fn () => $connection->table('refused_write_sentinel')->update(['value' => 2]));

        $this->assertSame(DatabaseUsedWithoutHookDatabase::by(self::class)->getMessage(), $refusal->getMessage());
        $this->assertSame(1, $this->sentinelValue($pdo));
    }

    private function refusalOf(callable $query): DatabaseUsedWithoutHookDatabase
    {
        try {
            $query();
        } catch (DatabaseUsedWithoutHookDatabase $refusal) {
            return $refusal;
        }

        $this->fail('The query ran without RefreshHookDatabase.');
    }

    private function sentinelValue(PDO $pdo): int
    {
        $statement = $pdo->query('SELECT value FROM refused_write_sentinel');
        $this->assertNotFalse($statement);

        return (int) $statement->fetchColumn();
    }
}

<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use Illuminate\Database\DatabaseManager;
use Illuminate\Testing\ParallelTesting;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\HookDatabase;
use Tests\Support\HookDatabaseRefused;
use Tests\TestCase;

final class HookDatabaseTest extends TestCase
{
    protected function tearDown(): void
    {
        $this->app->make(ParallelTesting::class)->resolveTokenUsing(null);

        parent::tearDown();
    }

    public function test_a_serial_run_passes_on_the_base_database(): void
    {
        $this->runAs('journal_hooks_test', false);

        HookDatabase::select($this->app);

        $this->assertSame('journal_hooks_test', HookDatabase::expectedName($this->app));
        $this->assertFalse(HookDatabase::isParallelWorker($this->app));
    }

    public function test_a_worker_passes_on_its_own_database(): void
    {
        $this->runAs('journal_hooks_test_test_3', '3');

        HookDatabase::select($this->app);

        $this->assertSame('journal_hooks_test_test_3', HookDatabase::expectedName($this->app));
        $this->assertTrue(HookDatabase::isParallelWorker($this->app));
    }

    /**
     * @return array<string, array{string, string|false, string}>
     */
    public static function refusedDatabases(): array
    {
        return [
            'another worker database' => ['journal_hooks_test_test_2', '3', 'journal_hooks_test_test_3'],
            'the shared database in a worker' => ['journal_hooks_test', '3', 'journal_hooks_test_test_3'],
            'a worker database in a serial run' => ['journal_hooks_test_test_1', false, 'journal_hooks_test'],
            'the application database' => ['journal', false, 'journal_hooks_test'],
        ];
    }

    #[DataProvider('refusedDatabases')]
    public function test_a_database_other_than_the_expected_one_is_refused(string $selected, string|false $token, string $expected): void
    {
        $this->runAs($selected, $token);

        $refusal = $this->refusalOfSelect();

        $this->assertStringContainsString($selected, $refusal->getMessage());
        $this->assertStringContainsString($expected, $refusal->getMessage());
        $this->assertNothingWasTouched();
    }

    public function test_the_shared_database_in_a_worker_points_to_the_parallel_artisan_command(): void
    {
        $this->runAs('journal_hooks_test', '3');

        $this->assertStringContainsString('php artisan test --parallel', $this->refusalOfSelect()->getMessage());
    }

    public function test_any_database_is_refused_outside_the_testing_environment(): void
    {
        $this->runAs('journal_hooks_test', false);
        $this->app['env'] = 'local';

        $this->assertSame(HookDatabaseRefused::outsideTesting()->getMessage(), $this->refusalOfSelect()->getMessage());
        $this->assertNothingWasTouched();
    }

    private function runAs(string $database, string|false $token): void
    {
        $connection = $this->app['config']->get('database.default');
        $this->app['config']->set("database.connections.{$connection}.database", $database);
        $this->app->make(DatabaseManager::class)->purge($connection);
        $this->app->make(DatabaseManager::class)->connection()->enableQueryLog();
        $this->app->make(ParallelTesting::class)->resolveTokenUsing(fn () => $token);
    }

    private function refusalOfSelect(): HookDatabaseRefused
    {
        try {
            HookDatabase::select($this->app);
        } catch (HookDatabaseRefused $refusal) {
            return $refusal;
        }

        $this->fail('The hook database guard let the database through.');
    }

    private function assertNothingWasTouched(): void
    {
        $connection = $this->app->make(DatabaseManager::class)->connection();

        $this->assertSame(0, $connection->transactionLevel());
        $this->assertSame([], $connection->getQueryLog());
    }
}

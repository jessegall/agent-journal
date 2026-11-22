<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use Illuminate\Database\DatabaseManager;
use Illuminate\Testing\ParallelTesting;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\Exceptions\HookDatabaseRefused;
use Tests\Support\HookDatabase;
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

    public function test_the_journal_runs_pass_on_the_checkpoint_database_and_its_worker_copies(): void
    {
        $this->runAs('journal_hooks_test_checkpoint', false);
        HookDatabase::select($this->app);

        $this->runAs('journal_hooks_test_checkpoint_test_2', '2');
        HookDatabase::select($this->app);

        $this->assertSame('journal_hooks_test_checkpoint_test_2', HookDatabase::expectedName($this->app));
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
            'another worker of the checkpoint database' => [
                'journal_hooks_test_checkpoint_test_2',
                '3',
                'journal_hooks_test_checkpoint_test_3',
            ],
            'the checkpoint database in a worker' => [
                'journal_hooks_test_checkpoint',
                '3',
                'journal_hooks_test_checkpoint_test_3',
            ],
            'a name only close to a test database' => ['journal_hooks_test_extra', false, 'journal_hooks_test'],
        ];
    }

    #[DataProvider('refusedDatabases')]
    public function test_a_database_other_than_the_expected_one_is_refused(
        string $selected,
        string|false $token,
        string $expected,
    ): void {
        $this->runAs($selected, $token);

        $refusal = $this->refusalOf(fn () => HookDatabase::select($this->app));

        $this->assertStringContainsString($selected, $refusal->getMessage());
        $this->assertStringContainsString($expected, $refusal->getMessage());
        $this->assertNothingWasTouched();
    }

    public function test_the_shared_database_in_a_worker_points_to_the_parallel_artisan_command(): void
    {
        $this->runAs('journal_hooks_test', '3');

        $refusal = $this->refusalOf(fn () => HookDatabase::select($this->app));

        $this->assertSame(
            HookDatabaseRefused::baseDatabaseInWorker(HookDatabase::NAME, HookDatabase::expectedName($this->app))
                ->getMessage(),
            $refusal->getMessage(),
        );
    }

    public function test_any_database_is_refused_outside_the_testing_environment(): void
    {
        $this->runAs('journal_hooks_test', false);
        $this->app['env'] = 'local';

        $this->assertSame(
            HookDatabaseRefused::outsideTesting()->getMessage(),
            $this->refusalOf(fn () => HookDatabase::select($this->app))->getMessage(),
        );
        $this->assertNothingWasTouched();
    }

    public function test_a_parallel_run_on_another_base_database_is_refused_before_any_worker_database_exists(): void
    {
        $this->runAs('journal', false);

        $this->assertSame(
            HookDatabaseRefused::otherDatabase('journal', 'journal_hooks_test')->getMessage(),
            $this->refusalOf(fn () => HookDatabase::checkBase($this->app))->getMessage(),
        );

        $this->assertNothingWasTouched();
    }

    public function test_a_worktree_database_name_must_be_plain(): void
    {
        $this->runAs('journal_hooks_test_wt_Not-Plain', false);

        $refusal = $this->refusalOf(fn () => HookDatabase::checkBase($this->app));

        $this->assertSame(
            HookDatabaseRefused::otherDatabase('journal_hooks_test_wt_Not-Plain', 'journal_hooks_test')->getMessage(),
            $refusal->getMessage(),
        );
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

    private function refusalOf(callable $check): HookDatabaseRefused
    {
        try {
            $check();
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

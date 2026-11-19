<?php

declare(strict_types=1);

namespace Tests\Feature\Reads;

use App\Reads\Attributes\ReadBudget;
use App\Reads\Contracts\ReadMeter;
use Domain\Access\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Tests\Support\AssertsReadBudget;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The read meter counts the queries of the work it measures, a failed one too, counts a nested measurement in both,
 * and starts at zero in each new scope.
 */
final class ReadMeterTest extends TestCase
{
    use AssertsReadBudget;
    use RefreshHookDatabase;

    public function test_a_measurement_counts_the_queries_of_its_work_and_keeps_its_value(): void
    {
        User::factory()->create();

        $measurement = $this->meter()->measure('count users', fn () => User::query()->count());

        $this->assertSame(1, $measurement->value);
        $this->assertSame(1, $measurement->counts->queriesRun);
        $this->assertSame(['read' => 1, 'write' => 0], $measurement->counts->queriesByCategory);
    }

    public function test_a_failed_query_still_counts_and_its_failure_is_thrown_again(): void
    {
        $meter = $this->meter();
        $counted = null;

        try {
            $meter->measure('outer', function () use ($meter, &$counted): void {
                try {
                    DB::select('select * from no_such_table');
                } finally {
                    $counted = $meter->current()->queriesRun;
                }
            });
            $this->fail('The failed query was not thrown again.');
        } catch (QueryException) {
            $this->assertSame(1, $counted);
        }
    }

    public function test_a_nested_measurement_counts_in_both_once(): void
    {
        $meter = $this->meter();
        $inner = null;

        $outer = $meter->measure('outer', function () use ($meter, &$inner): void {
            User::query()->count();
            $inner = $meter->measure('inner', fn () => User::query()->exists());
        });

        $this->assertSame(1, $inner?->counts->queriesRun);
        $this->assertSame(2, $outer->counts->queriesRun);
    }

    public function test_each_hydrated_model_counts_even_the_same_row_twice_and_a_pluck_loads_none(): void
    {
        $user = User::factory()->create();

        $twice = $this->meter()->measure(
            'twice',
            fn () => [User::query()->find($user->id), User::query()->find($user->id)],
        );
        $plucked = $this->meter()->measure('pluck', fn () => User::query()->pluck('id'));
        $quiet = $this->meter()->measure(
            'without events',
            fn () => User::withoutEvents(fn () => User::query()->find($user->id)),
        );

        $this->assertSame(2, $twice->counts->modelsLoaded);
        $this->assertSame([User::class => 2], $twice->counts->modelsByClass);
        $this->assertSame(0, $plucked->counts->modelsLoaded);
        $this->assertSame(1, $quiet->counts->modelsLoaded);
    }

    public function test_each_new_scope_starts_at_zero(): void
    {
        $first = $this->meter();
        $first->measure('first request', fn () => User::query()->count());
        $this->app->forgetScopedInstances();

        $this->assertNotSame($first, $this->meter());
        $this->assertSame(0, $this->meter()->current()->queriesRun);
    }

    public function test_a_reader_call_is_held_to_its_declared_budget_in_one_line(): void
    {
        User::factory()->create();

        $this->assertWithinReadBudget(fn () => $this->countUsers(), [self::class, 'countUsers']);
        $this->assertSame(1, $this->readCounts(fn () => $this->countUsers())->queriesRun);
    }

    #[ReadBudget(queries: 1, models: 0)]
    public function countUsers(): int
    {
        return User::query()->count();
    }

    private function meter(): ReadMeter
    {
        return $this->app->make(ReadMeter::class);
    }
}

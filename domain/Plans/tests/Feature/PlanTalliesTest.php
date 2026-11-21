<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * Phases and plans keep their task tallies on their own rows, moved in the transaction of each placement and each
 * task change, so a plan card reads them without reading a task.
 */
final class PlanTalliesTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'plans',
        'phases',
        'phase_tasks',
        'tasks',
        'task_runs',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'claim_authorizations',
        'command_receipts',
    ];

    public function test_placing_starting_finishing_and_cancelling_moves_the_phase_and_plan_tallies(): void
    {
        $plan = Plan::factory()->create();
        $phase = $this->structure()->addPhase($plan, 'Work');
        [$first, $second, $third] = Task::factory()->count(3)->create()->all();
        $this->startUserRequestAs($this->owner->id);
        $this->structure()->addTasks($phase, [$first->id, $second->id, $third->id]);

        $this->runCommand(new StartTask($first->id));
        $this->runCommand(new StartTask($second->id));
        $this->runCommand(new FinishTask($second->id, 1, 'Done.'));
        $this->runCommand(new CancelTask($third->id, 'Not needed.'));

        foreach ([$phase->refresh()->progress, $plan->refresh()->progress] as $progress) {
            $this->assertSame(
                ['total' => 3, 'finished' => 1, 'cancelled' => 1, 'started' => 1, 'blocked' => 0, 'unfinished' => 1],
                self::tallies($progress),
            );
        }

        $this->runCommand(new CancelTask($first->id, 'Dropped.'));

        $this->assertSame(
            ['total' => 3, 'finished' => 1, 'cancelled' => 2, 'started' => 0, 'blocked' => 0, 'unfinished' => 0],
            self::tallies($phase->refresh()->progress),
        );
    }

    public function test_the_current_phase_is_the_last_when_all_are_complete_and_none_without_phases(): void
    {
        $finishedOne = new PlanProgress(finished: 1, cancelled: 0, blocked: 0, started: 0, total: 1);
        $cancelledOne = new PlanProgress(finished: 0, cancelled: 1, blocked: 0, started: 0, total: 1);

        $this->assertSame(2, PlanProgress::currentPhaseOf([1 => $finishedOne, 2 => PlanProgress::none()]));
        $this->assertSame(1, PlanProgress::currentPhaseOf([1 => $cancelledOne, 2 => PlanProgress::none()]));
        $this->assertNull(PlanProgress::currentPhaseOf([]));
    }

    public function test_a_card_read_loads_the_same_rows_however_many_tasks_the_plan_holds(): void
    {
        $this->startUserRequestAs($this->owner->id);
        $small = $this->planWithTasks('Small plan', 1);
        $large = $this->planWithTasks('Large plan', 40);

        $this->assertSame($this->rowsLoadedReading('Small plan'), $this->rowsLoadedReading('Large plan'));
        $this->assertSame(40, $large->refresh()->total_tasks);
        $this->assertSame(1, $small->refresh()->total_tasks);
    }

    private function planWithTasks(string $title, int $count): Plan
    {
        $plan = Plan::factory()->create(['title' => $title]);
        $this->structure()->addTasks(
            $this->structure()->addPhase($plan, 'Work'),
            array_values(Task::factory()->count($count)->create()->modelKeys()),
        );

        return $plan;
    }

    /**
     * The models and queries one card read loads; no task row and no task place is among them.
     *
     * @return array{models: int, queries: int}
     */
    private function rowsLoadedReading(string $title): array
    {
        $models = 0;
        Event::listen('eloquent.retrieved: *', function () use (&$models): void {
            $models++;
        });
        DB::flushQueryLog();
        DB::enableQueryLog();

        $this->app->make(PlanResolver::class)->list(new PlanFilters(search: $title));

        $queries = DB::getQueryLog();
        DB::disableQueryLog();
        Event::forget('eloquent.retrieved: *');

        $this->assertSame([], array_filter(
            array_column($queries, 'query'),
            fn (string $query) => str_contains($query, '"tasks"') || str_contains($query, '"phase_tasks"'),
        ));

        return ['models' => $models, 'queries' => count($queries)];
    }

    /**
     * @return array<string, int>
     */
    private static function tallies(PlanProgress $progress): array
    {
        return [
            'total' => $progress->total,
            'finished' => $progress->finished,
            'cancelled' => $progress->cancelled,
            'started' => $progress->started,
            'blocked' => $progress->blocked,
            'unfinished' => $progress->unfinished(),
        ];
    }

    private function runCommand(object $command): void
    {
        $this->app->make(CommandBus::class)->run($command);
    }

    private function structure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}

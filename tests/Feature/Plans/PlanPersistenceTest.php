<?php

declare(strict_types=1);

namespace Tests\Feature\Plans;

use App\Core\Hooks\Storage\StackTarget;
use App\Domain\Plans\Database\Seeders\PlansSeeder;
use App\Domain\Plans\Exceptions\TaskAlreadyInAPhase;
use App\Domain\Plans\Models\Plan;
use App\Domain\Plans\PlanKind;
use App\Domain\Plans\PlanState;
use App\Domain\Tasks\Models\Task;
use App\Domain\Tasks\TaskCounts;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

final class PlanPersistenceTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    public function test_phases_and_their_tasks_keep_their_order(): void
    {
        $plan = Plan::query()->create(['title' => 'Build the plans page', 'kind' => PlanKind::Build]);
        $read = $plan->addPhase('Read');
        $start = $plan->addPhase('Start');
        $second = $this->task('Second');
        $first = $this->task('First');
        $third = $this->task('Third');

        $read->addTask($second);
        $start->addTask($third);
        $read->addTask($first);

        $this->assertSame(['Read', 'Start'], $plan->phases()->pluck('title')->all());
        $this->assertSame([$second->id, $first->id], $read->taskIds());
        $this->assertSame([$second->id, $first->id, $third->id], $plan->taskIds());
        $this->assertSame([PlanState::Planned, false], [$plan->fresh()?->state, $plan->fresh()?->focused]);
    }

    public function test_a_task_sits_in_one_phase_at_most(): void
    {
        $plan = Plan::query()->create(['title' => 'Fix the login redirect', 'kind' => PlanKind::Fix]);
        $task = $this->task('Write a failing test');
        $plan->addPhase('Reproduce')->addTask($task);

        $this->expectException(TaskAlreadyInAPhase::class);

        $plan->addPhase('Fix')->addTask($task);
    }

    public function test_tasks_count_progress_by_id_including_none(): void
    {
        $done = $this->task('Done');
        $done->finish();
        $started = $this->task('Started');
        $started->startFor(new StackTarget(1, 10));
        $open = $this->task('Open');
        $counts = $this->app->make(TaskCounts::class);

        $progress = $counts->progressOf([$done->id, $started->id, $open->id]);

        $this->assertSame([1, 1, 0, 3], [$progress->done, $progress->started, $progress->blocked, $progress->total]);
        $this->assertSame(0, $counts->progressOf([])->total);
    }

    public function test_every_agent_reads_every_plan(): void
    {
        Plan::query()->create(['title' => 'Compare chat layouts', 'kind' => PlanKind::Research]);

        $this->startRequestAs(2, 20);

        $this->assertSame(['Compare chat layouts'], Plan::query()->pluck('title')->all());
    }

    public function test_the_local_seeder_fills_plans_with_phases_and_tasks(): void
    {
        $this->seed(PlansSeeder::class);

        $this->assertSame(3, Plan::query()->count());
        $this->assertCount(4, Plan::query()->where('title', 'Build the plans page')->sole()->taskIds());
    }

    private function task(string $title): Task
    {
        return Task::query()->create(['title' => $title]);
    }
}

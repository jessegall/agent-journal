<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Agents\Support\StackTarget;
use Database\Seeders\DatabaseSeeder;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\TaskAlreadyInAPhase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Readers\TaskCounts;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;

final class PlanPersistenceTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    public function test_phases_and_their_tasks_keep_their_order(): void
    {
        $plan = Plan::query()->create(['title' => 'Build the plans page', 'type' => PlanType::Build]);
        $read = $plan->addPhase('Read');
        $start = $plan->addPhase('Start');
        $second = $this->task('Second');
        $first = $this->task('First');
        $third = $this->task('Third');

        $read->addTask($second->id);
        $start->addTask($third->id);
        $read->addTask($first->id);

        $this->assertSame(['Read', 'Start'], $plan->phases()->pluck('title')->all());
        $this->assertSame([$second->id, $first->id], $read->taskIds());
        $this->assertSame([$second->id, $first->id, $third->id], $plan->taskIds());
        $this->assertSame([PlanState::Planned, false], [$plan->fresh()?->state, $plan->fresh()?->focused]);
    }

    public function test_a_task_sits_in_one_phase_at_most(): void
    {
        $plan = Plan::query()->create(['title' => 'Fix the login redirect', 'type' => PlanType::Fix]);
        $task = $this->task('Write a failing test');
        $plan->addPhase('Reproduce')->addTask($task->id);

        $this->expectException(TaskAlreadyInAPhase::class);

        $plan->addPhase('Fix')->addTask($task->id);
    }

    public function test_tasks_count_progress_by_id_including_none(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(7));
        $done = $this->task('Done');
        $done->finish();
        $started = $this->task('Started');
        $started->startFor(new StackTarget(1, 10));
        $open = $this->task('Open');
        $counts = $this->app->make(TaskProgressCounter::class);
        $this->assertInstanceOf(TaskCounts::class, $counts);

        $progress = $counts->progressOf([$done->id, $started->id, $open->id]);

        $this->assertSame([1, 1, 0, 3], [$progress->done, $progress->started, $progress->blocked, $progress->total]);
        $this->assertSame(0, $counts->progressOf([])->total);
    }

    public function test_every_agent_reads_every_plan(): void
    {
        Plan::query()->create(['title' => 'Compare chat layouts', 'type' => PlanType::Research]);

        $this->startRequestAs(2, 20);

        $this->assertSame(['Compare chat layouts'], Plan::query()->pluck('title')->all());
    }

    public function test_the_local_seeders_fill_plans_with_phases_and_the_tasks_from_tasks(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(3, Plan::query()->count());
        $this->assertCount(4, Plan::query()->where('title', 'Build the plans page')->sole()->taskIds());
    }

    private function task(string $title): Task
    {
        return Task::query()->create(['title' => $title]);
    }
}

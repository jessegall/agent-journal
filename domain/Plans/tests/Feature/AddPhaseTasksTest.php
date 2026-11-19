<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\AddPhaseTasks;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\TaskAlreadyInAPhase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * Plans puts tasks into phases by id, after Tasks confirmed they exist.
 */
final class AddPhaseTasksTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits AddPhaseTasks for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['plans', 'phases', 'phase_tasks', 'tasks'];

    public function test_tasks_join_a_phase_in_order_once_tasks_confirmed_them(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );
        $phase = Plan::factory()->create(['title' => 'Build', 'type' => PlanType::Build])->addPhase('Read');
        $first = Task::factory()->create(['title' => 'First'])->id;
        $second = Task::factory()->create(['title' => 'Second'])->id;

        $this->app->make(CommandBus::class)->run(new AddPhaseTasks($phase->id, 1, [$second, $first]));

        $this->assertSame([$second, $first], $phase->taskIds());
    }

    public function test_one_missing_task_refuses_the_whole_addition(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );
        $phase = Plan::factory()->create(['title' => 'Build', 'type' => PlanType::Build])->addPhase('Read');
        $real = Task::factory()->create(['title' => 'Real'])->id;

        try {
            $this->app->make(CommandBus::class)->run(new AddPhaseTasks($phase->id, 1, [$real, TestIds::of(999999)]));
            $this->fail('A missing task was added.');
        } catch (TaskMissing) {
            $this->assertSame([], $phase->taskIds());
        }
    }

    public function test_a_task_named_twice_is_refused_before_anything_is_written(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );
        $phase = Plan::factory()->create(['title' => 'Build', 'type' => PlanType::Build])->addPhase('Read');
        $task = Task::factory()->create(['title' => 'Twice'])->id;

        try {
            $this->app->make(CommandBus::class)->run(new AddPhaseTasks($phase->id, 1, [$task, $task]));
            $this->fail('A task named twice was added.');
        } catch (TaskAlreadyInAPhase $refusal) {
            $this->assertEquals(TaskAlreadyInAPhase::forTask($task), $refusal);
            $this->assertSame([], $phase->taskIds());
        }
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature\Plans;

use App\Core\Actors\ActorContext;
use App\Core\Contracts\EstablishActor;
use App\Domain\Plans\Actions\AddPhaseTasks;
use App\Domain\Plans\Api\PlanKind;
use App\Domain\Plans\Exceptions\TaskAlreadyInAPhase;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\Exceptions\TaskMissing;
use App\Domain\Tasks\Models\Task;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Plans puts tasks into phases by id, after Tasks confirmed they exist.
 */
final class AddPhaseTasksTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_tasks_join_a_phase_in_order_once_tasks_confirmed_them(): void
    {
        $this->app->make(EstablishActor::class)->establish(ActorContext::forUser(7));
        $phase = Plan::query()->create(['title' => 'Build', 'kind' => PlanKind::Build])->addPhase('Read');
        $first = Task::query()->create(['title' => 'First'])->id;
        $second = Task::query()->create(['title' => 'Second'])->id;

        $this->app->make(AddPhaseTasks::class)->add($phase, [$second, $first]);

        $this->assertSame([$second, $first], $phase->taskIds());
    }

    public function test_one_missing_task_refuses_the_whole_addition(): void
    {
        $this->app->make(EstablishActor::class)->establish(ActorContext::forUser(7));
        $phase = Plan::query()->create(['title' => 'Build', 'kind' => PlanKind::Build])->addPhase('Read');
        $real = Task::query()->create(['title' => 'Real'])->id;

        try {
            $this->app->make(AddPhaseTasks::class)->add($phase, [$real, 999999]);
            $this->fail('A missing task was added.');
        } catch (TaskMissing) {
            $this->assertSame([], $phase->taskIds());
        }
    }

    public function test_a_task_named_twice_is_refused_before_anything_is_written(): void
    {
        $phase = Plan::query()->create(['title' => 'Build', 'kind' => PlanKind::Build])->addPhase('Read');
        $task = Task::query()->create(['title' => 'Twice'])->id;

        $this->expectExceptionObject(TaskAlreadyInAPhase::forTask($task));

        $phase->addTasks([$task, $task]);
    }
}

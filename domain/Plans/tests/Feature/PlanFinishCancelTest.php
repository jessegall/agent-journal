<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssigneeIdentity;
use App\Bus\Contracts\CommandBus;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Api\Events\PlanCancelled;
use Domain\Plans\Api\Events\PlanFinished;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Plans\Commands\CancelPlan;
use Domain\Plans\Commands\FinishPlan;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Exceptions\PlanHasUnfinishedTasks;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\Event;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;

/**
 * A plan finishes only once started with every task finished or cancelled, and keeps its note; a cancel keeps every
 * task and assignment; a second start announces nothing.
 */
final class PlanFinishCancelTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'plans', 'phases', 'phase_tasks', 'tasks', 'assignments', 'agents', 'command_receipts'];

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->owner = $owner;
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($owner->id), new OwnerAuthority('test'));
        Event::fake([PlanStarted::class, PlanFinished::class, PlanCancelled::class]);
    }

    public function test_finishing_a_plan_with_an_open_task_is_refused_with_the_count(): void
    {
        $plan = $this->startedPlan([TaskState::Finished, TaskState::Open, TaskState::Blocked]);

        $this->assertThrows(fn () => $this->bus()->run(new FinishPlan($plan->id, 1, 'Done.')), PlanHasUnfinishedTasks::class, '2 unfinished tasks');
        $this->assertSame(PlanState::Started, $plan->fresh()?->state);
        Event::assertNotDispatched(PlanFinished::class);
    }

    public function test_finishing_a_plan_whose_tasks_are_done_records_the_note_and_the_done_state(): void
    {
        $plan = $this->startedPlan([TaskState::Finished, TaskState::Cancelled]);

        $this->bus()->run(new FinishPlan($plan->id, 1, 'Shipped.'));

        $this->assertSame([PlanState::Done, 'Shipped.', 2], [$plan->fresh()?->state, $plan->fresh()?->finish_note, $plan->fresh()?->revision]);
        Event::assertDispatchedTimes(PlanFinished::class, 1);
    }

    public function test_cancelling_keeps_every_task_and_assignment(): void
    {
        $plan = $this->startedPlan([TaskState::Open, TaskState::Started]);
        $this->app->make(AssignmentWriterInTransaction::class)->assign($plan->assignmentIdentity(), new AssigneeIdentity(ActorType::User->value, $this->owner->id));
        $assignments = AssignmentRecord::query()->withoutGlobalScopes()->count();

        $this->bus()->run(new CancelPlan($plan->id, 1, 'Superseded.'));

        $this->assertSame([PlanState::Cancelled, 'Superseded.'], [$plan->fresh()?->state, $plan->fresh()?->cancel_reason]);
        $this->assertSame([TaskState::Open, TaskState::Started], Task::query()->whereKey($plan->taskIds())->orderBy('number')->pluck('state')->all());
        $this->assertSame($assignments, AssignmentRecord::query()->withoutGlobalScopes()->count());
        Event::assertDispatchedTimes(PlanCancelled::class, 1);
    }

    public function test_a_second_start_of_a_started_plan_emits_no_second_event(): void
    {
        $plan = Plan::factory()->create();

        $this->bus()->run(new StartPlan($plan->id));
        $this->bus()->run(new StartPlan($plan->id));

        Event::assertDispatchedTimes(PlanStarted::class, 1);
    }

    /**
     * @param  list<TaskState>  $states
     */
    private function startedPlan(array $states): Plan
    {
        $plan = Plan::factory()->create();
        $plan->startOnce();
        $plan->addPhase('Work')->addTasks(array_map(fn (TaskState $state): string => $this->taskIn($state)->id, $states));

        return $plan;
    }

    private function taskIn(TaskState $state): Task
    {
        $task = Task::factory()->create();

        match ($state) {
            TaskState::Started => $task->start(),
            TaskState::Blocked => $task->block(),
            TaskState::Finished => $task->finish(),
            TaskState::Cancelled => $task->cancel(),
            TaskState::Open => null,
        };

        return $task;
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}

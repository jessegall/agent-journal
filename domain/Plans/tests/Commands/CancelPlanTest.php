<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandInputInvalid;
use App\Models\Access\User;
use App\Models\Records\AssignmentRecord;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Values\OwnerAuthority;
use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Exceptions\PlanRevisionChanged;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\Event;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;

/**
 * A plan is cancelled with its reason and keeps every task and assignment as they were; a reason past its limit and
 * a plan no longer in the state the caller saw are refused.
 */
final class CancelPlanTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'plans',
        'phases',
        'phase_tasks',
        'tasks',
        'assignments',
        'agents',
        'command_receipts',
    ];

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->owner = $owner;
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($owner->id), new OwnerAuthority('test'));
        Event::fake([
            PlanStarted::class,
            PlanFinished::class,
            PlanCancelled::class,
        ]);
    }

    public function test_cancelling_keeps_every_task_and_assignment(): void
    {
        $plan = $this->startedPlan([
            TaskStatus::Open,
            TaskStatus::Started,
        ]);

        $this->app->make(AssignmentWriterInTransaction::class)->assign(
            $plan->assignmentIdentity(),
            new AssigneeIdentity(User::storedType(), $this->owner->id),
        );

        $assignments = AssignmentRecord::query()->withoutGlobalScopes()->count();

        $this->bus()->run(new CancelPlanCommand($plan->id, 1, 'Superseded.'));

        $this->assertSame(
            [
                PlanStatus::Cancelled,
                'Superseded.',
            ],
            [
                $plan->fresh()?->status,
                $plan->fresh()?->cancel_reason,
            ],
        );

        $this->assertSame(
            [
                TaskStatus::Open,
                TaskStatus::Started,
            ],
            Task::query()->whereKey($plan->taskIds())->orderBy('number')->pluck('status')->all(),
        );

        $this->assertSame($assignments, AssignmentRecord::query()->withoutGlobalScopes()->count());
        Event::assertDispatchedTimes(PlanCancelled::class, 1);
    }

    public function test_a_long_reason_and_a_state_that_moved_on_are_refused(): void
    {
        $plan = $this->startedPlan([TaskStatus::Open]);

        $this->assertThrows(
            fn () => $this->bus()->run(new CancelPlanCommand($plan->id, 1, str_repeat('é', Plan::NOTE_CHARACTER_LIMIT + 1))),
            CommandInputInvalid::class,
            'reason:',
        );
        $this->assertThrows(
            fn () => $this->bus()->run(new CancelPlanCommand($plan->id, 1, 'Not needed.', PlanStatus::Planned)),
            PlanRevisionChanged::class,
        );
        $this->assertSame(PlanStatus::Started, $plan->fresh()?->status);
    }

    /**
     * @param  list<TaskStatus>  $states
     */
    private function startedPlan(array $states): Plan
    {
        $plan = Plan::factory()->create();
        $plan->startOnce(ActorContext::forUser($this->owner->id));

        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($plan, 'Work'),
            array_map(fn (TaskStatus $state): string => $this->taskIn($state)->id, $states),
        );

        return $plan;
    }

    private function taskIn(TaskStatus $state): Task
    {
        $task = Task::factory()->create();

        match ($state) {
            TaskStatus::Started => $task->start(ActorIdentity::system()),
            TaskStatus::Blocked => $task->block('Waits.'),
            TaskStatus::Finished => $task->finish('Done.'),
            TaskStatus::Cancelled => $task->cancel('Not needed.'),
            TaskStatus::Open => null,
        };

        return $task;
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}

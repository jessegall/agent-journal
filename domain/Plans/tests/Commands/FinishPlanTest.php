<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandInputInvalid;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use App\Support\ActorReference;
use Domain\Plans\Commands\FinishPlan\FinishPlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Exceptions\PlanHasUnfinishedTasks;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * A started plan whose tasks are all done finishes with its note, once, saying who finished it; a plan with tasks
 * still open, a plan not started and an empty or long note are refused.
 */
#[TestsCommand(FinishPlanCommand::class)]
final class FinishPlanTest extends TestCase
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
        'agent_sessions',
        'agent_stacks',
        'session_tokens',
    ];

    private User $owner;

    private PlanFixtures $plans;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->owner()->ownerUser();
        $this->plans = $this->journal->fixtures(PlanFixtures::class);

        $this->journal->observeEvents(
            AccessSettings::class,
            CurrentActorSetter::class,
            PlanStarted::class,
            PlanFinished::class,
            PlanCancelled::class,
        );
    }

    public function test_finishing_a_plan_with_an_open_task_is_refused_with_the_count(): void
    {
        $plan = $this->startedPlan([TaskStatus::Finished, TaskStatus::Open, TaskStatus::Blocked]);

        $this->assertThrows(
            fn () => $this->bus()->run(new FinishPlanCommand($plan->id, 1, 'Done.')),
            PlanHasUnfinishedTasks::class,
            PlanHasUnfinishedTasks::for($plan->number, 2)->getMessage(),
        );

        $this->assertSame(PlanStatus::Started, $plan->fresh()?->status);
        $this->journal->assertEventCount(PlanFinished::class, 0);
    }

    public function test_finishing_a_plan_whose_tasks_are_done_records_the_note_and_the_done_state(): void
    {
        $plan = $this->startedPlan([TaskStatus::Finished, TaskStatus::Cancelled]);

        $this->bus()->run(new FinishPlanCommand($plan->id, 1, 'Shipped.'));

        $this->assertSame(
            [PlanStatus::Done, 'Shipped.', 2],
            [$plan->fresh()?->status, $plan->fresh()?->finish_note, $plan->fresh()?->revision],
        );

        $this->journal->assertEventCount(PlanFinished::class, 1);

        $this->journal->assertEvent(
            PlanFinished::class,
            fn (PlanFinished $finished) => $finished->finishedBy == ActorReference::forUser($this->owner->id),
        );
    }

    public function test_an_empty_or_long_note_and_a_plan_not_started_are_refused(): void
    {
        $plan = $this->startedPlan([TaskStatus::Finished]);

        foreach ([
            '',
            str_repeat('é', Plan::NOTE_CHARACTER_LIMIT + 1),
        ] as $note) {
            $this->assertThrows(
                fn () => $this->bus()->run(new FinishPlanCommand($plan->id, 1, $note)),
                CommandInputInvalid::class,
                'note:',
            );
        }

        $planned = $this->plans->createPlan('Planned');

        $this->assertThrows(
            fn () => $this->bus()->run(new FinishPlanCommand($planned->id, 1, 'Done.')),
            PlanHasUnfinishedTasks::class,
        );

        $this->assertSame(PlanStatus::Started, $plan->fresh()?->status);
    }

    /**
     * @param  list<TaskStatus>  $states
     */
    private function startedPlan(array $states): Plan
    {
        $tasks = array_map(fn (TaskStatus $status) => $this->taskIn($status)->assignmentIdentity(), $states);

        return $this->plans->startedPlan('Release')->phase(
            'Release',
            'Work',
        )->placeTasks('Work', ...$tasks)->planCalled('Release');
    }

    private function taskIn(TaskStatus $status): Task
    {
        $task = Task::factory()->create();

        match ($status) {
            TaskStatus::Started => $task->start(ActorReference::system()),
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

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }
}

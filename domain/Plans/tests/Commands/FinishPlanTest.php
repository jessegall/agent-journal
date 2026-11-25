<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandInputInvalid;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use Domain\Plans\Commands\FinishPlan\FinishPlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Exceptions\PlanHasUnfinishedTasks;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
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

    private TestStart $caller;

    private string $ownerId;

    private const string RELEASE_NOTE = 'Release complete.';

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
        $plan = $this->startedPlan([
            TaskStatus::Finished,
            TaskStatus::Open,
            TaskStatus::Blocked,
        ]);

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
        $plan = $this->startedPlan([
            TaskStatus::Finished,
            TaskStatus::Cancelled,
        ]);

        $this->bus()->run(new FinishPlanCommand($plan->id, 1, 'Shipped.'));

        $this->assertSame(
            [
                PlanStatus::Done,
                'Shipped.',
                2,
            ],
            [
                $plan->fresh()?->status,
                $plan->fresh()?->finish_note,
                $plan->fresh()?->revision,
            ],
        );

        $this->journal->assertEventCount(PlanFinished::class, 1);

        $this->journal->assertEvent(
            PlanFinished::class,
            fn (PlanFinished $finished) => $finished->finishedBy == ActorIdentity::forUser($this->owner->id),
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

        $planned = $this->plans->plan('Planned')->planCalled('Planned');

        $this->assertThrows(
            fn () => $this->bus()->run(new FinishPlanCommand($planned->id, 1, 'Done.')),
            PlanHasUnfinishedTasks::class,
        );

        $this->assertSame(PlanStatus::Started, $plan->fresh()?->status);
    }

    public function test_an_agent_builds_starts_reads_and_finishes_a_plan_across_the_two_surfaces(): void
    {
        $owner = $this->journal->ownerUser();
        $this->ownerId = $owner->id;
        $this->caller = $this->journal->signedStart('Main agent', 'main-agent');

        $this->caller->openStack($this->app);

        $create = [
            'title' => 'Release', 'brief' => 'Ship the release.', 'type' => 'build', 'request_key' => 'make-plan',
        ];

        $id = $this->journal->mcpTool($this->caller, 'plans_create', $create)->assertOk()
            ->assertJsonPath('result.isError', false)->json('result.structuredContent.plan_id');

        $this->journal->agentCall(
            $this->caller,
            'POST',
            '/agent/plans/create',
            $create,
        )->assertOk()->assertJsonPath('plan_id', $id);

        $first = $this->phase($id, 'Build', 'make-build-phase');
        $second = $this->phase($id, 'Check', 'make-check-phase');
        $build = Task::factory()->create();
        $check = Task::factory()->create();
        $this->addTask($first, $build, 'add-build-task');
        $this->addTask($second, $check, 'add-check-task');

        $started = $this->journal->mcpTool(
            $this->caller,
            'plans_start',
            [
                'plan_id' => $id,
                'request_key' => 'start-plan',
            ],
        )->assertOk();

        $this->assertFalse($started->json('result.isError'), $started->getContent());
        $started->assertJsonPath('result.structuredContent.state', 'started');

        $this->journal->mcpTool($this->caller, 'phases_read', ['phase_id' => $first])->assertOk()
            ->assertJsonPath('result.structuredContent.task_ids', [$build->id]);

        $this->journal->actAsUserId(($this->ownerId));
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new FinishTaskCommand($build->id, 0, 'Done.'));
        $bus->run(new FinishTaskCommand($check->id, 0, 'Done.'));

        $read = $this->journal->mcpTool(
            $this->caller,
            'plans_read',
            [
                'plan_id' => $id,
                'view' => 'context',
            ],
        )->assertOk()
            ->assertJsonPath('result.structuredContent.progress.finished', 2)
            ->assertJsonPath('result.structuredContent.progress.total', 2)
            ->assertJsonPath('result.structuredContent.phases.0.phase_id', $first)
            ->assertJsonPath('result.structuredContent.phases.1.phase_id', $second)
            ->json('result.structuredContent');

        $this->assertSame($read, $this->resource("journal://v1/plans/{$id}?view=context"));

        $finish = [
            'plan_id' => $id,
            'expected_revision' => $read['revision'],
            'note' => 'Release complete.',
            'request_key' => 'finish-plan',
        ];

        $this->journal->mcpTool($this->caller, 'plans_finish', $finish)->assertOk()
            ->assertJsonPath('result.isError', false)->assertJsonPath('result.structuredContent.state', 'done');

        $this->journal->agentCall(
            $this->caller,
            'POST',
            '/agent/plans/finish',
            $finish,
        )->assertOk()->assertJsonPath('plan_id', $id);

        $this->journal->mcpTool($this->caller, 'plans_read', [
            'plan_id' => $id,
            'view' => 'context',
        ])->assertOk()
            ->assertJsonPath('result.structuredContent.finish_note', self::RELEASE_NOTE);
    }

    /**
     * @param  list<TaskStatus>  $states
     */
    private function startedPlan(array $states): Plan
    {
        $tasks = array_map(fn (TaskStatus $state) => $this->taskIn($state)->assignmentIdentity(), $states);

        return $this->plans->startedPlan('Release')->phase(
            'Release',
            'Work',
        )->placeTasks('Work', ...$tasks)->planCalled('Release');
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

    /**
     * @return array<string, mixed>
     */
    private function resource(string $uri): array
    {
        return json_decode(
            $this->journal->mcpRequest($this->caller, 'resources/read', ['uri' => $uri])->assertOk()
                ->json('result.contents.0.text'),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
    }

    private function addTask(string $phaseId, Task $task, string $key): void
    {
        $this->journal->mcpTool($this->caller, 'phases_add_tasks', [
            'phase_id' => $phaseId,
            'expected_revision' => 1,
            'task_ids' => [$task->id],
            'request_key' => $key,
        ])->assertOk()->assertJsonPath('result.isError', false);
    }

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    private function phase(string $planId, string $title, string $key): string
    {
        return $this->journal->mcpTool($this->caller, 'phases_create', [
            'plan_id' => $planId,
            'title' => $title,
            'request_key' => $key,
        ])->assertOk()->assertJsonPath('result.isError', false)->json('result.structuredContent.phase_id');
    }
}

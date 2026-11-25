<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Records\AssignmentRecord;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use Domain\Plans\Commands\AssignPlanWork\AssignPlanWorkCommand;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;

/**
 * A user gives out a plan's work at once: the plan, its unfinished phases, an empty phase and their open tasks take
 * the holder and a phase whose tasks are all over is skipped; a task that vanished aborts the whole of it, and work
 * added later takes no holder from it.
 */
#[TestsCommand(AssignPlanWorkCommand::class)]
final class AssignPlanWorkTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'agents',
        'agent_stacks',
        'inboxes',
        'inbox_members',
        'tasks',
        'plans',
        'phases',
        'phase_tasks',
        'assignments',
        'number_groups',
        'command_receipts',
        'agent_sessions',
        'session_tokens',
    ];

    private AssigneeIdentity $builder;

    private Plan $plan;

    private Phase $working;

    private Phase $over;

    private Phase $empty;

    private Task $open;

    private TestStart $helper;

    private TestStart $main;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->idleAgent('Builder', 'read-only-helper');
        $this->builder = AssigneeIdentity::of($this->journal->agentCalled('Builder'));

        $tasks = $this->journal->fixtures(TaskFixtures::class)
            ->task('Open')
            ->finishedTask('Finished')
            ->cancelledTask('Cancelled');

        $plans = $this->journal->fixtures(PlanFixtures::class)
            ->plan('Release')
            ->phaseWithTask('Release', 'Working', $tasks->taskCalled('Open')->assignmentIdentity())
            ->phase('Release', 'Over')
            ->placeTasks(
                'Over',
                $tasks->taskCalled('Finished')->assignmentIdentity(),
                $tasks->taskCalled('Cancelled')->assignmentIdentity(),
            )
            ->phase('Release', 'Empty');

        $this->plan = $plans->planCalled('Release');
        $this->open = $tasks->taskCalled('Open');

        [$this->working, $this->over, $this->empty] = [
            $plans->phaseCalled('Working'),
            $plans->phaseCalled('Over'),
            $plans->phaseCalled('Empty'),
        ];
    }

    public function test_a_plan_cascade_gives_its_unfinished_phases_and_tasks_and_skips_a_finished_phase(): void
    {
        $result = $this->assignWork($this->plan->assignmentIdentity(), $this->builder);

        $this->assertCount(4, $result->changes);

        $this->assertEqualsCanonicalizing([
            [
                Plan::linkType(),
                $this->plan->id,
            ],
            [
                Phase::linkType(),
                $this->working->id,
            ],
            [
                Phase::linkType(),
                $this->empty->id,
            ],
            [
                'tasks.task',
                $this->open->id,
            ],
        ], AssignmentRecord::query()->get()->map(
            fn (AssignmentRecord $row) => [
                $row->record_type,
                $row->record_id,
            ],
        )->all());
    }

    public function test_a_task_that_vanished_from_a_phase_aborts_the_cascade(): void
    {
        PhaseTask::query()->insert(
            [
                'id' => strtolower((string) Str::ulid()),
                'phase_id' => $this->working->id,
                'task_id' => TestIds::of(99999),
                'position' => 2,
            ],
        );

        $this->assertThrows(
            fn () => $this->assignWork($this->plan->assignmentIdentity(), $this->builder),
            TaskMissing::class,
        );

        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_work_added_after_a_cascade_takes_no_holder_from_it(): void
    {
        $this->assignWork($this->plan->assignmentIdentity(), $this->builder);
        $late = Task::factory()->create(['title' => 'Added later']);

        $this->planStructure()->addTasks($this->working, [$late->id]);
        $this->planStructure()->addPhase($this->plan, 'Added later');

        $this->assertSame(4, AssignmentRecord::query()->count());

        $this->assertFalse(
            AssignmentRecord::query()->where('record_type', 'tasks.task')->where('record_id', $late->id)->exists(),
        );
    }

    public function test_the_commands_say_they_covered_the_whole_plan(): void
    {
        $owner = $this->journal->ownerUser();
        $this->main = $this->journal->signedStart('Main agent', 'main-agent');
        $this->helper = $this->journal->signedStart('Reader', 'read-only-helper');
        $plan = Plan::factory()->create([
            'title' => 'Release',
            'type' => PlanType::Build,
        ]);
        $open = $this->tasks()->createTask('Open command');
        $finished = $this->tasks()->createTask('Finished command');
        $finished->finish('Done.');
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Working'), [$open->id]);
        $this->planStructure()->addTasks($this->planStructure()->addPhase($plan, 'Over'), [$finished->id]);

        $this->journal->relayAgentCommands($this->main);

        $this->artisan(
            'plan:assign-work',
            [
                'type' => Plan::linkType(),
                'id' => $plan->id,
                '--to' => "agent:{$this->helper->agent->id}",
            ],
        )
            ->expectsOutputToContain(
                sprintf(
                    'Cascade over plans.plan %s and its unfinished work: 3 changed, 0 unchanged, 2 skipped as finished.',
                    $plan->id,
                ),
            )
            ->assertExitCode(0);

        $this->artisan(
            'plan:unassign-work',
            [
                'type' => Plan::linkType(),
                'id' => $plan->id,
                '--assignment' => TestIds::of(999999),
                '--holder' => "agent:{$this->helper->agent->id}",
            ],
        )
            ->expectsOutputToContain('The journal refused the call (')->assertExitCode(1);

        $this->artisan('plan:assign-work', [
            'type' => Plan::linkType(),
            'id' => $plan->id,
            '--to' => 'nobody',
        ])
            ->expectsOutputToContain('type:id')->assertExitCode(1);
    }

    private function assignWork(RecordIdentity $root, AssigneeIdentity $recipient): AssignmentResult
    {
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run(new AssignPlanWorkCommand($root, $recipient));
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}

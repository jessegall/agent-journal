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
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A user gives out a plan's work at once: the plan, its unfinished phases, an empty phase and their open tasks take
 * the holder and a phase whose tasks are all over is skipped; a task that vanished aborts the whole of it, and work
 * added later takes no holder from it.
 */
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
    ];

    private AssigneeIdentity $builder;

    private Plan $plan;

    private Phase $working;

    private Phase $over;

    private Phase $empty;

    private Task $open;

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
            [Plan::linkType(), $this->plan->id],
            [Phase::linkType(), $this->working->id],
            [Phase::linkType(), $this->empty->id],
            ['tasks.task', $this->open->id],
        ], AssignmentRecord::query()->get()->map(
            fn (AssignmentRecord $row) => [$row->record_type, $row->record_id],
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

    private function assignWork(RecordIdentity $root, AssigneeIdentity $recipient): AssignmentResult
    {
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run(new AssignPlanWorkCommand($root, $recipient));
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Models\Agent;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Models\AssignmentRecord;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Plans\Contracts\PlanAssignments;
use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\PhaseTask;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\Exceptions\TaskMissing;
use App\Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Giving out a plan's or a phase's work at once: the plan collects its phases and their tasks under its structure lock,
 * an empty phase takes a holder, a phase whose tasks are all over is skipped, a task that vanished aborts the cascade,
 * and work added later takes no holder from it.
 */
final class PlanCascadeTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'tasks', 'plans', 'phases', 'phase_tasks', 'assignments'];

    private ActorIdentity $builder;

    private Plan $plan;

    private Phase $working;

    private Phase $over;

    private Phase $empty;

    private Task $open;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $this->builder = ActorIdentity::of(Agent::query()->create(['name' => 'Builder', 'role' => 'hooks.read_only_helper_ready']));
        $this->plan = Plan::query()->create(['title' => 'Release', 'kind' => PlanKind::Build]);
        $this->open = Task::query()->create(['title' => 'Open']);
        $finished = Task::query()->create(['title' => 'Finished']);
        $cancelled = Task::query()->create(['title' => 'Cancelled']);
        $finished->finish();
        $cancelled->cancel();
        $this->working = $this->plan->addPhase('Working');
        $this->working->addTasks([$this->open->id]);
        $this->over = $this->plan->addPhase('Over');
        $this->over->addTasks([$finished->id, $cancelled->id]);
        $this->empty = $this->plan->addPhase('Empty');
    }

    public function test_assigning_the_plan_alone_touches_nothing_under_it(): void
    {
        $this->app->make(AssignmentWriter::class)->assign($this->plan->assignmentIdentity(), $this->builder);

        $this->assertSame([Plan::LINK_TYPE], $this->heldTypes());
    }

    public function test_a_plan_cascade_gives_the_plan_its_unfinished_phases_and_tasks_and_skips_a_phase_whose_work_is_over(): void
    {
        $result = $this->cascades()->assign($this->plan->assignmentIdentity(), $this->builder);

        $this->assertCount(4, $result->changes);
        $this->assertEqualsCanonicalizing([
            [Plan::LINK_TYPE, $this->plan->id],
            [Phase::LINK_TYPE, $this->working->id],
            [Phase::LINK_TYPE, $this->empty->id],
            ['tasks.task', $this->open->id],
        ], AssignmentRecord::query()->get()->map(fn (AssignmentRecord $row) => [$row->record_type, $row->record_id])->all());
    }

    public function test_a_phase_cascade_covers_that_phase_and_its_tasks_only_and_releasing_it_clears_them(): void
    {
        $root = $this->cascades()->assign($this->working->assignmentIdentity(), $this->builder)->outcomes[0]->current->get();

        $this->assertEqualsCanonicalizing([Phase::LINK_TYPE, 'tasks.task'], $this->heldTypes());

        $this->cascades()->unassign($this->working->assignmentIdentity(), $root->reference);

        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_a_task_that_vanished_from_a_phase_aborts_the_cascade(): void
    {
        PhaseTask::query()->insert(['phase_id' => $this->working->id, 'task_id' => 999999, 'position' => 2]);

        $this->assertThrows(fn () => $this->cascades()->assign($this->plan->assignmentIdentity(), $this->builder), TaskMissing::class);

        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_work_added_after_a_cascade_takes_no_holder_from_it(): void
    {
        $this->cascades()->assign($this->plan->assignmentIdentity(), $this->builder);
        $late = Task::query()->create(['title' => 'Added later']);

        $this->working->addTasks([$late->id]);
        $this->plan->addPhase('Added later');

        $this->assertSame(4, AssignmentRecord::query()->count());
        $this->assertFalse(AssignmentRecord::query()->where('record_type', 'tasks.task')->where('record_id', $late->id)->exists());
    }

    /**
     * @return list<string>
     */
    private function heldTypes(): array
    {
        return array_values(AssignmentRecord::query()->pluck('record_type')->all());
    }

    private function cascades(): PlanAssignments
    {
        return $this->app->make(PlanAssignments::class);
    }
}

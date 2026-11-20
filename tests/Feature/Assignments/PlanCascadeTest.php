<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Agents\Models\Agent;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Records\Support\RecordIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Commands\AssignPlanWork;
use Domain\Plans\Commands\UnassignPlanWork;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
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

    private AssigneeIdentity $builder;

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
        $this->builder = AssigneeIdentity::of(Agent::named('Builder', 'read-only-helper'));
        $this->plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $this->open = Task::factory()->create(['title' => 'Open']);
        $finished = Task::factory()->create(['title' => 'Finished']);
        $cancelled = Task::factory()->create(['title' => 'Cancelled']);
        $finished->finish('Done.');
        $cancelled->cancel('Not needed.');
        $this->working = $this->plan->addPhase('Working');
        $this->working->addTasks([$this->open->id]);
        $this->over = $this->plan->addPhase('Over');
        $this->over->addTasks([$finished->id, $cancelled->id]);
        $this->empty = $this->plan->addPhase('Empty');
    }

    public function test_assigning_the_plan_alone_touches_nothing_under_it(): void
    {
        $this->app->make(AssignmentWriterInTransaction::class)->assign(
            $this->plan->assignmentIdentity(),
            $this->builder,
        );

        $this->assertSame([Plan::LINK_TYPE], $this->heldTypes());
    }

    public function test_a_plan_cascade_gives_its_unfinished_phases_and_tasks_and_skips_a_finished_phase(): void
    {
        $result = $this->assignWork($this->plan->assignmentIdentity(), $this->builder);

        $this->assertCount(4, $result->changes);
        $this->assertEqualsCanonicalizing([
            [Plan::LINK_TYPE, $this->plan->id],
            [Phase::LINK_TYPE, $this->working->id],
            [Phase::LINK_TYPE, $this->empty->id],
            ['tasks.task', $this->open->id],
        ], AssignmentRecord::query()->get()->map(
            fn (AssignmentRecord $row) => [$row->record_type, $row->record_id],
        )->all());
    }

    public function test_a_phase_cascade_covers_that_phase_and_its_tasks_only_and_releasing_it_clears_them(): void
    {
        $root = $this->assignWork($this->working->assignmentIdentity(), $this->builder)->outcomes[0]->current;

        $this->assertEqualsCanonicalizing([Phase::LINK_TYPE, 'tasks.task'], $this->heldTypes());

        $this->unassignWork($this->working->assignmentIdentity(), $root->reference);

        $this->assertSame(0, AssignmentRecord::query()->count());
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

        $this->working->addTasks([$late->id]);
        $this->plan->addPhase('Added later');

        $this->assertSame(4, AssignmentRecord::query()->count());
        $this->assertFalse(
            AssignmentRecord::query()->where('record_type', 'tasks.task')->where('record_id', $late->id)->exists(),
        );
    }

    /**
     * @return list<string>
     */
    private function heldTypes(): array
    {
        return array_values(AssignmentRecord::query()->pluck('record_type')->all());
    }

    private function assignWork(RecordIdentity $root, AssigneeIdentity $recipient): AssignmentResult
    {
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run(new AssignPlanWork($root, $recipient));
    }

    private function unassignWork(RecordIdentity $root, AssignmentReference $expectedRoot): AssignmentResult
    {
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run(new UnassignPlanWork($root, $expectedRoot));
    }
}

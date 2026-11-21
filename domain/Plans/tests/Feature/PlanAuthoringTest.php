<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Assignments\Models\AssignmentRecord;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestIds;

/**
 * A plan is created with its brief and creator, edited only at the revision the caller read, and grows phase by phase;
 * a phase takes all of its new tasks or none.
 */
final class PlanAuthoringTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = [
        'plans',
        'phases',
        'phase_tasks',
        'tasks',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'assignments',
        'command_receipts',
    ];

    private TestStart $start;

    protected function setUp(): void
    {
        parent::setUp();

        $this->start = TestStart::start();
    }

    public function test_the_plans_and_phases_tables_have_the_authoring_columns(): void
    {
        $this->assertTrue(
            Schema::hasColumns(
                'plans',
                ['brief', 'creator_type', 'creator_id', 'revision', 'finish_note', 'cancel_reason'],
            ),
        );
        $this->assertTrue(Schema::hasColumn('phases', 'revision'));
    }

    public function test_a_plan_is_created_with_its_creator(): void
    {
        $planId = $this->signed(
            $this->start,
            '/agent/plans/create',
            [
                'title' => 'Release',
                'brief' => 'Ship version 6.',
                'type' => 'build',
                'request_key' => bin2hex(random_bytes(8)),
            ],
        )->assertOk()->json('plan_id');

        $plan = Plan::query()->findOrFail($planId);
        $this->assertSame(
            ['Ship version 6.', PlanType::Build, PlanState::Planned, 1],
            [$plan->brief, $plan->type, $plan->state, $plan->revision],
        );
        $this->assertSame([ActorType::Agent, $this->start->agent->id], [$plan->creator_type, $plan->creator_id]);
    }

    public function test_phases_append_in_order(): void
    {
        $plan = Plan::factory()->create();

        foreach (['Read', 'Build', 'Check'] as $title) {
            $this->signed(
                $this->start,
                '/agent/plans/phases/create',
                ['plan_id' => $plan->id, 'title' => $title, 'request_key' => bin2hex(random_bytes(8))],
            )->assertOk();
        }

        $this->assertSame(
            ['Read', 'Build', 'Check'],
            Phase::query()->where('plan_id', $plan->id)->orderBy('number')->pluck('title')->all(),
        );
    }

    public function test_adding_one_invisible_task_among_three_adds_none(): void
    {
        $phase = $this->planStructure()->addPhase(Plan::factory()->create(), 'Build');
        $tasks = [Task::factory()->create()->id, TestIds::of(999999), Task::factory()->create()->id];

        $this->signed(
            $this->start,
            '/agent/plans/phases/add-tasks',
            [
                'phase_id' => $phase->id,
                'expected_revision' => 1,
                'task_ids' => $tasks,
                'request_key' => bin2hex(random_bytes(8)),
            ],
        )->assertStatus(404)->assertJsonPath('code', 'record_unavailable');

        $this->assertSame([], $phase->taskIds());
        $this->assertSame(1, $phase->fresh()?->revision);
    }

    public function test_a_stale_phase_revision_adds_nothing(): void
    {
        $phase = $this->planStructure()->addPhase(Plan::factory()->create(), 'Build');
        $this->signed(
            $this->start,
            '/agent/plans/phases/add-tasks',
            [
                'phase_id' => $phase->id,
                'expected_revision' => 1,
                'task_ids' => [Task::factory()->create()->id],
                'request_key' => bin2hex(random_bytes(8)),
            ],
        )->assertOk();

        $this->signed(
            $this->start,
            '/agent/plans/phases/add-tasks',
            [
                'phase_id' => $phase->id,
                'expected_revision' => 1,
                'task_ids' => [Task::factory()->create()->id],
                'request_key' => bin2hex(random_bytes(8)),
            ],
        )->assertConflict();

        $this->assertCount(1, $phase->taskIds());
        $this->assertSame(2, $phase->fresh()?->revision);
    }

    public function test_a_stale_plan_edit_is_a_conflict_and_keeps_the_newer_text_and_assignments_stay(): void
    {
        $plan = Plan::factory()->create(['title' => 'First', 'brief' => 'First brief']);
        $plan->describe('Second', 'Second brief', PlanType::Fix);
        $assignments = AssignmentRecord::query()->withoutGlobalScopes()->count();

        $this->signed(
            $this->start,
            '/agent/plans/edit',
            [
                'plan_id' => $plan->id,
                'expected_revision' => 1,
                'title' => 'Stale',
                'request_key' => bin2hex(random_bytes(8)),
            ],
        )->assertConflict();
        $this->signed(
            $this->start,
            '/agent/plans/edit',
            [
                'plan_id' => $plan->id,
                'expected_revision' => 2,
                'brief' => 'Third brief',
                'request_key' => bin2hex(random_bytes(8)),
            ],
        )->assertOk()->assertJson(['revision' => 3]);

        $this->assertSame(
            ['Second', 'Third brief', PlanType::Fix, 3],
            [$plan->fresh()?->title, $plan->fresh()?->brief, $plan->fresh()?->type, $plan->fresh()?->revision],
        );
        $this->assertSame($assignments, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}

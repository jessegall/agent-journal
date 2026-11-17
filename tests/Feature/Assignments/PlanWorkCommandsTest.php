<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Core\Assignments\Models\AssignmentRecord;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Plans\Enums\PlanType;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\Models\Task;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * A plan's or a phase's whole unfinished work in one call: a main agent gives, moves and releases it with counts that
 * match what changed and no record under the root named, a stale root reference changes nothing, a helper may not,
 * and the commands say they covered the whole plan or phase.
 */
final class PlanWorkCommandsTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = ['users', 'agents', 'agent_sessions', 'launch_credentials', 'tasks', 'plans', 'phases', 'phase_tasks', 'assignments'];

    private TestLaunch $main;

    private TestLaunch $helper;

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->main = TestLaunch::start('hooks.main_ready');
        $this->helper = TestLaunch::start('hooks.read_only_helper_ready');
        $this->plan = Plan::query()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $open = Task::query()->create(['title' => 'Open']);
        $finished = Task::query()->create(['title' => 'Finished']);
        $finished->finish();
        $this->plan->addPhase('Working')->addTasks([$open->id]);
        $this->plan->addPhase('Over')->addTasks([$finished->id]);
    }

    public function test_a_main_agent_gives_moves_and_releases_a_plans_work_with_matching_counts(): void
    {
        $root = ['rootType' => Plan::LINK_TYPE, 'rootId' => $this->plan->id];

        $given = $this->signed($this->main, '/agent/plans/work/assign', [...$root, 'recipientType' => 'agent', 'recipientId' => $this->helper->agent->id])
            ->assertOk()->assertJson(['cascade' => true, 'changed' => 3, 'unchanged' => 0, 'skipped' => 2])->assertJsonMissingPath('outcomes');
        $reference = (int) $given->json('root.holder.reference');
        $this->assertSame(3, AssignmentRecord::query()->withoutGlobalScopes()->count());

        $this->signed($this->main, '/agent/plans/work/reassign', [...$root, 'assignmentId' => 999999, 'holderType' => 'agent', 'holderId' => $this->helper->agent->id, 'recipientType' => 'agent', 'recipientId' => $this->main->agent->id])
            ->assertConflict();
        $this->signed($this->helper, '/agent/plans/work/unassign', [...$root, 'assignmentId' => $reference, 'holderType' => 'agent', 'holderId' => $this->helper->agent->id])
            ->assertForbidden();
        $moved = $this->signed($this->main, '/agent/plans/work/reassign', [...$root, 'assignmentId' => $reference, 'holderType' => 'agent', 'holderId' => $this->helper->agent->id, 'recipientType' => 'agent', 'recipientId' => $this->main->agent->id])
            ->assertOk()->assertJson(['changed' => 3, 'skipped' => 2]);
        $this->signed($this->main, '/agent/plans/work/unassign', [...$root, 'assignmentId' => (int) $moved->json('root.holder.reference'), 'holderType' => 'agent', 'holderId' => $this->main->agent->id])
            ->assertOk()->assertJson(['changed' => 3]);

        $this->assertSame(0, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_the_commands_say_they_covered_the_whole_plan(): void
    {
        $this->runCommandsAs($this->main->token);

        $this->artisan('plan:assign-work', ['type' => Plan::LINK_TYPE, 'id' => $this->plan->id, '--to' => "agent:{$this->helper->agent->id}"])
            ->expectsOutputToContain("Cascade over plans.plan {$this->plan->id} and its unfinished work: 3 changed, 0 unchanged, 2 skipped as finished.")
            ->assertExitCode(0);
        $this->artisan('plan:unassign-work', ['type' => Plan::LINK_TYPE, 'id' => $this->plan->id, '--assignment' => 999999, '--holder' => "agent:{$this->helper->agent->id}"])
            ->expectsOutputToContain('(409)')->assertExitCode(1);
        $this->artisan('plan:assign-work', ['type' => Plan::LINK_TYPE, 'id' => $this->plan->id, '--to' => 'nobody'])
            ->expectsOutputToContain('type:id')->assertExitCode(1);
    }
}

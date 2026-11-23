<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Models\Records\AssignmentRecord;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestIds;
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

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'tasks',
        'plans',
        'phases',
        'phase_tasks',
        'assignments',
    ];

    private TestStart $main;

    private TestStart $helper;

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->main = TestStart::start('main-agent');
        $this->helper = TestStart::start('read-only-helper');
        $this->plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $open = Task::factory()->create(['title' => 'Open']);
        $finished = Task::factory()->create(['title' => 'Finished']);
        $finished->finish('Done.');
        $this->planStructure()->addTasks($this->planStructure()->addPhase($this->plan, 'Working'), [$open->id]);
        $this->planStructure()->addTasks($this->planStructure()->addPhase($this->plan, 'Over'), [$finished->id]);
    }

    public function test_a_main_agent_gives_moves_and_releases_a_plans_work_with_matching_counts(): void
    {
        $root = ['root_type' => Plan::LINK_TYPE, 'root_id' => $this->plan->id];

        $given = $this->signed(
            $this->main,
            '/agent/plans/work/assign',
            [
                ...$root,
                'recipient_type' => 'agent',
                'recipient_id' => $this->helper->agent->id,
                'request_key' => (string) Str::ulid(),
            ],
        )
            ->assertOk()->assertJson(
                ['cascade' => true, 'changed' => 3, 'unchanged' => 0, 'skipped' => 2],
            )->assertJsonMissingPath('outcomes');
        $reference = (string) $given->json('root.holder.reference');
        $this->assertSame(3, AssignmentRecord::query()->withoutGlobalScopes()->count());

        $this->signed(
            $this->main,
            '/agent/plans/work/reassign',
            [
                ...$root,
                'assignment_id' => TestIds::of(999999),
                'holder_type' => 'agent',
                'holder_id' => $this->helper->agent->id,
                'recipient_type' => 'agent',
                'recipient_id' => $this->main->agent->id,
                'request_key' => (string) Str::ulid(),
            ],
        )
            ->assertConflict();
        $this->signed(
            $this->helper,
            '/agent/plans/work/unassign',
            [
                ...$root,
                'assignment_id' => $reference,
                'holder_type' => 'agent',
                'holder_id' => $this->helper->agent->id,
                'request_key' => (string) Str::ulid(),
            ],
        )
            ->assertForbidden();
        $moved = $this->signed(
            $this->main,
            '/agent/plans/work/reassign',
            [
                ...$root,
                'assignment_id' => $reference,
                'holder_type' => 'agent',
                'holder_id' => $this->helper->agent->id,
                'recipient_type' => 'agent',
                'recipient_id' => $this->main->agent->id,
                'request_key' => (string) Str::ulid(),
            ],
        )
            ->assertOk()->assertJson(['changed' => 3, 'skipped' => 2]);
        $this->signed(
            $this->main,
            '/agent/plans/work/unassign',
            [
                ...$root,
                'assignment_id' => (string) $moved->json('root.holder.reference'),
                'holder_type' => 'agent',
                'holder_id' => $this->main->agent->id,
                'request_key' => (string) Str::ulid(),
            ],
        )
            ->assertOk()->assertJson(['changed' => 3]);

        $this->assertSame(0, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_a_plan_and_a_phase_are_named_by_number_and_a_bad_number_is_refused(): void
    {
        $assign = fn (array $root) => $this->signed($this->main, '/agent/plans/work/assign', [
            ...$root,
            'recipient_type' => 'agent',
            'recipient_id' => $this->helper->agent->id,
            'request_key' => (string) Str::ulid(),
        ]);

        $assign(['root_type' => Plan::LINK_TYPE, 'root_id' => (string) $this->plan->number])->assertOk();
        $assign(['root_type' => 'plans.phase', 'root_id' => '1', 'root_plan' => (string) $this->plan->number])
            ->assertOk();
        $assign(['root_type' => 'plans.phase', 'root_id' => '1'])->assertStatus(422);

        foreach (['0', '-1', '1e3', '9223372036854775808'] as $number) {
            $assign(['root_type' => Plan::LINK_TYPE, 'root_id' => $number])
                ->assertStatus(422)
                ->assertSee($number);
        }
    }

    public function test_the_commands_say_they_covered_the_whole_plan(): void
    {
        $this->runCommandsAs($this->main);

        $this->artisan(
            'plan:assign-work',
            ['type' => Plan::LINK_TYPE, 'id' => $this->plan->id, '--to' => "agent:{$this->helper->agent->id}"],
        )
            ->expectsOutputToContain(
                sprintf(
                    'Cascade over plans.plan %s and its unfinished work: 3 changed, 0 unchanged, 2 skipped as finished.',
                    $this->plan->id,
                ),
            )
            ->assertExitCode(0);
        $this->artisan(
            'plan:unassign-work',
            [
                'type' => Plan::LINK_TYPE,
                'id' => $this->plan->id,
                '--assignment' => TestIds::of(999999),
                '--holder' => "agent:{$this->helper->agent->id}",
            ],
        )
            ->expectsOutputToContain('The journal refused the call (')->assertExitCode(1);
        $this->artisan('plan:assign-work', ['type' => Plan::LINK_TYPE, 'id' => $this->plan->id, '--to' => 'nobody'])
            ->expectsOutputToContain('type:id')->assertExitCode(1);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}

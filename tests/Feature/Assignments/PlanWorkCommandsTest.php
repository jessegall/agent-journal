<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
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

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'tasks',
        'plans',
        'phases',
        'phase_tasks',
        'assignments',
        'number_groups',
        'command_receipts',
        'inboxes',
        'inbox_members',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    private TestStart $main;

    private TestStart $helper;

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = $this->journal->owner()->ownerUser();
        $this->main = TestStart::start('main-agent');
        $this->helper = TestStart::start('read-only-helper');
        $this->plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $open = $this->tasks()->task('Open')->taskCalled('Open');
        $finished = $this->tasks()->task('Finished')->taskCalled('Finished');
        $finished->finish('Done.');
        $this->planStructure()->addTasks($this->planStructure()->addPhase($this->plan, 'Working'), [$open->id]);
        $this->planStructure()->addTasks($this->planStructure()->addPhase($this->plan, 'Over'), [$finished->id]);
    }

    public function test_the_commands_say_they_covered_the_whole_plan(): void
    {
        $this->journal->relayAgentCommands($this->main);

        $this->artisan(
            'plan:assign-work',
            ['type' => Plan::linkType(), 'id' => $this->plan->id, '--to' => "agent:{$this->helper->agent->id}"],
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
                'type' => Plan::linkType(),
                'id' => $this->plan->id,
                '--assignment' => TestIds::of(999999),
                '--holder' => "agent:{$this->helper->agent->id}",
            ],
        )
            ->expectsOutputToContain('The journal refused the call (')->assertExitCode(1);
        $this->artisan('plan:assign-work', ['type' => Plan::linkType(), 'id' => $this->plan->id, '--to' => 'nobody'])
            ->expectsOutputToContain('type:id')->assertExitCode(1);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}

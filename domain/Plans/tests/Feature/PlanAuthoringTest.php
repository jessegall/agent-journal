<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;

/**
 * A plan is created with its brief and creator, edited only at the revision the caller read, and grows phase by phase;
 * a phase takes all of its new tasks or none.
 */
final class PlanAuthoringTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'plans',
        'phases',
        'phase_tasks',
        'tasks',
        'agents',
        'agent_sessions',
        'session_tokens',
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

    public function test_a_stale_phase_revision_adds_nothing(): void
    {
        $phase = $this->journal->owner()->fixtures(PlanFixtures::class)->plan('Release')->phase('Release', 'Build')
            ->phaseCalled('Build');

        $this->journal->agentCall($this->start, 'POST', '/agent/plans/phases/add-tasks', [
            'phase_id' => $phase->id,
            'expected_revision' => 1,
            'task_ids' => [Task::factory()->create()->id],
            'request_key' => bin2hex(random_bytes(8)),
        ])->assertOk();

        $this->journal->agentCall($this->start, 'POST', '/agent/plans/phases/add-tasks', [
            'phase_id' => $phase->id,
            'expected_revision' => 1,
            'task_ids' => [Task::factory()->create()->id],
            'request_key' => bin2hex(random_bytes(8)),
        ])->assertConflict();

        $this->assertCount(1, $phase->taskIds());
        $this->assertSame(2, $phase->fresh()?->revision);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}

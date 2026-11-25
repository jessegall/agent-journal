<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Commands;

use App\Exceptions\StackAlreadyClosed;
use App\Models\Agents\AgentStackRow;
use Carbon\CarbonImmutable;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Support\States\Support\FollowSequenceStateReference;
use Domain\Sequences\Tests\Fixtures\SequenceFixtures;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\StateObservation;

/**
 * An agent starts a run in its session: the run runs at its first step, follows the agent and puts its state on the
 * agent's stack in the same commit; a push that fails rolls the start back.
 */
final class StartSequenceTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'sequence_runs',
        'agent_stacks',
        'command_receipts',
    ];

    private const string RUN = 'Close a task';

    private SequenceFixtures $runs;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer')->actAs('Writer');
        $this->runs = $this->journal->fixtures(SequenceFixtures::class)->run(self::RUN, [
            'Read the brief.',
            'Run the phase tests.',
        ]);
    }

    public function test_a_started_run_follows_the_agent_at_its_first_step_with_its_state_on_the_stack(): void
    {
        $this->runs->startRun(self::RUN, 'Writer')->assertStep(self::RUN, 1, 'Writer');

        $this->journal->stateOn(
            $this->journal->sessionOf('Writer'),
            FollowSequenceStateReference::forRun($this->runs->runCalled(self::RUN)),
        )->given([], fn (StateObservation $state) => $state->assertOnTop());
    }

    public function test_a_failed_push_rolls_the_start_back(): void
    {
        AgentStackRow::query()->withoutGlobalScopes()
            ->forTarget($this->journal->sessionOf('Writer')->target)
            ->sole()
            ->closeAt(CarbonImmutable::now());

        $this->journal->assertRefused(StackAlreadyClosed::class, fn () => $this->runs->startRun(self::RUN, 'Writer'));

        $this->runs->assertUnassigned(self::RUN, 1, SequenceRunStatus::Running);
    }
}

<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\StackAlreadyClosed;
use App\Models\Agents\AgentStackRow;
use Carbon\CarbonImmutable;
use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Tests\Fixtures\SequenceFixtures;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestIds;

/**
 * An agent starts a run in its session: the run runs at its first step, follows the agent and puts its state on the
 * agent's stack in the same commit; a push that fails rolls the start back.
 */
final class StartSequenceTest extends TestCase
{
    use CommittedHookStack;

    public function test_a_started_run_follows_the_agent_at_its_first_step_with_its_state_on_the_stack(): void
    {
        $run = $this->journal->fixtures(SequenceFixtures::class)->run(
            'Close a task',
            ['Read the brief.', 'Run the phase tests.'],
        )->runCalled('Close a task');

        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($run->id, $this->target->sessionId));

        $run->refresh();
        $this->assertSame(
            [SequenceRunStatus::Running, 1, 'agent', TestIds::of(1)],
            [$run->status, $run->current_step, $run->actor_type, $run->actor_id],
        );
        $this->assertSame(['core.ready', 'sequences.follow'], $this->storedTypeKeys());
    }

    public function test_a_failed_push_rolls_the_start_back(): void
    {
        $run = $this->journal->fixtures(SequenceFixtures::class)->run(
            'Close a task',
            ['Read the brief.'],
        )->runCalled('Close a task');
        AgentStackRow::query()->sole()->closeAt(CarbonImmutable::now());

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(
                new StartSequenceCommand($run->id, $this->target->sessionId),
            ),
            StackAlreadyClosed::class,
        );
        $this->assertNull($run->refresh()->actor_id);
    }
}

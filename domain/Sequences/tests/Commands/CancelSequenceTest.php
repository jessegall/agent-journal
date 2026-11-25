<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use Domain\Sequences\Commands\CancelSequence\CancelSequenceCommand;
use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Tests\Fixtures\SequenceFixtures;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommittedHookStack;

/**
 * A running sequence is cancelled and stays at the step it reached.
 */
final class CancelSequenceTest extends TestCase
{
    use CommittedHookStack;

    public function test_a_cancelled_run_stays_at_the_step_it_reached(): void
    {
        $run = $this->journal->fixtures(SequenceFixtures::class)->run(
            'Close a task',
            ['Read the brief.', 'Run the phase tests.'],
        )->runCalled('Close a task');
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new StartSequenceCommand($run->id, $this->target->sessionId));

        $bus->run(new CancelSequenceCommand($run->id));

        $this->assertSame([SequenceRunStatus::Cancelled, 1], [$run->refresh()->status, $run->current_step]);
    }
}

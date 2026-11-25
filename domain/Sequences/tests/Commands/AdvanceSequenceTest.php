<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use Domain\Sequences\Commands\AdvanceSequence\AdvanceSequenceCommand;
use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Tests\Fixtures\SequenceFixtures;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommittedHookStack;

/**
 * A running sequence goes to its next step, and finishes once its last step is done.
 */
final class AdvanceSequenceTest extends TestCase
{
    use CommittedHookStack;

    public function test_a_run_goes_to_its_next_step_and_finishes_after_its_last(): void
    {
        $run = $this->journal->fixtures(SequenceFixtures::class)->run(
            'Close a task',
            ['Read the brief.', 'Run the phase tests.'],
        )->runCalled('Close a task');
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new StartSequenceCommand($run->id, $this->target->sessionId));

        $bus->run(new AdvanceSequenceCommand($run->id));
        $this->assertSame([SequenceRunStatus::Running, 2], [$run->refresh()->status, $run->current_step]);

        $bus->run(new AdvanceSequenceCommand($run->id));
        $this->assertSame(SequenceRunStatus::Finished, $run->refresh()->status);
    }
}

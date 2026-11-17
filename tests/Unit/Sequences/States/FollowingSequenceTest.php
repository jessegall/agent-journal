<?php

declare(strict_types=1);

namespace Tests\Unit\Sequences\States;

use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Decisions\StopPrevented;
use App\Core\Hooks\Enums\SimpleTransition;
use App\Core\Hooks\Inputs\CompactionDetails;
use App\Core\Hooks\Inputs\ContextCompacted;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Inputs\StopDetails;
use App\Core\Hooks\Inputs\StopRequested;
use App\Domain\Sequences\Enums\SequenceRunState;
use App\Domain\Sequences\States\FollowingSequenceState;
use App\Domain\Sequences\Support\SequenceWork;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\HookInputs;

final class FollowingSequenceTest extends TestCase
{
    /**
     * @return iterable<string, array{SequenceRunState}>
     */
    public static function settledStates(): iterable
    {
        yield 'finished' => [SequenceRunState::Finished];
        yield 'cancelled' => [SequenceRunState::Cancelled];
    }

    /**
     * @return iterable<string, array{HookInput}>
     */
    public static function otherHooks(): iterable
    {
        foreach (HookInputs::all() as $name => $input) {
            if (! $input instanceof StopRequested && ! $input instanceof ContextCompacted) {
                yield $name => [$input];
            }
        }
    }

    public function test_a_running_step_prevents_the_stop_with_the_current_instruction(): void
    {
        $decision = $this->following()->onStop($this->stop());

        $this->assertInstanceOf(StopPrevented::class, $decision->answer);
        $this->assertSame('Sequence run 8 is on step 3: Run the phase tests.', $decision->refusalReason());
        $this->assertSame(SimpleTransition::Keep, $decision->transition);
    }

    public function test_a_compaction_repeats_the_current_instruction_without_advancing(): void
    {
        $sequence = $this->running();
        $state = new FollowingSequenceState($sequence);

        $first = $state->onCompaction($this->compaction());
        $second = $state->onCompaction($this->compaction());

        $this->assertTrue($first->isDelegating());
        $this->assertSame(['Sequence run 8 is on step 3: Run the phase tests.'], $first->context);
        $this->assertSame($first->context, $second->context);
        $this->assertSame(SimpleTransition::Keep, $first->transition);
        $this->assertSame(3, $sequence->stepNumber);
    }

    #[DataProvider('settledStates')]
    public function test_a_settled_run_is_finished(SequenceRunState $state): void
    {
        $this->assertTrue((new FollowingSequenceState(new SequenceWork(8, 3, 'Run the phase tests.', $state)))->isFinished());
    }

    public function test_a_running_sequence_is_not_finished(): void
    {
        $this->assertFalse($this->following()->isFinished());
    }

    #[DataProvider('otherHooks')]
    public function test_every_other_hook_is_delegated(HookInput $input): void
    {
        $this->assertTrue($input->answerBy($this->following())->isDelegating());
    }

    private function running(): SequenceWork
    {
        return new SequenceWork(8, 3, 'Run the phase tests.', SequenceRunState::Running);
    }

    private function following(): FollowingSequenceState
    {
        return new FollowingSequenceState($this->running());
    }

    private function stop(): StopRequested
    {
        return new StopRequested($this->hook(), new StopDetails('turn-1', false));
    }

    private function compaction(): ContextCompacted
    {
        return new ContextCompacted($this->hook(), new CompactionDetails('compaction-1'));
    }

    private function hook(): HookIdentity
    {
        return new HookIdentity(1, 2, 'hook-1', 'digest');
    }
}

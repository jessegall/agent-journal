<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Unit\States;

use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Denied;
use App\Hooks\Enums\SimpleTransition;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\StopDetails;
use App\Hooks\Inputs\StopRequested;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\States\FollowingSequenceState;
use Domain\Sequences\Support\SequenceWork;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\TestIds;

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

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertSame('Sequence run 8 is on step 3: Run the phase tests.', $decision->refusalReason());
        $this->assertSame(SimpleTransition::Keep, $decision->transition);
    }

    public function test_its_current_step_is_its_foreground_instruction_and_reading_it_advances_nothing(): void
    {
        $sequence = $this->running();
        $state = new FollowingSequenceState($sequence);

        $this->assertSame('sequences.step', $state->instructionType());
        $this->assertSame('Sequence run 8 is on step 3: Run the phase tests.', $state->instructionText());
        $this->assertSame($state->instructionText(), $state->instructionText());
        $this->assertSame(3, $sequence->stepNumber);
    }

    #[DataProvider('settledStates')]
    public function test_a_settled_run_is_finished(SequenceRunState $state): void
    {
        $this->assertTrue(
            new FollowingSequenceState(new SequenceWork(8, 3, 'Run the phase tests.', $state))->isFinished(),
        );
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

    private function hook(): HookIdentity
    {
        return new HookIdentity(TestIds::of(1), TestIds::of(2), 'hook-1', 'digest');
    }
}

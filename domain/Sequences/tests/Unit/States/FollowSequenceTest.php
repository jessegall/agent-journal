<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Unit\States;

use App\Support\Decisions\Decision;
use App\Support\Decisions\Denied;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Sequences\Support\States\FollowSequenceState;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestText;
use Tests\TestCase;

final class FollowSequenceTest extends TestCase
{
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
        $state = $this->following();
        $decision = $state->onStop($this->stop());

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertSame(TestText::words($state->instruction()->get()), TestText::words($decision->refusalReason()));
    }

    public function test_its_current_step_is_its_foreground_instruction_and_reading_it_advances_nothing(): void
    {
        $state = $this->following();

        $this->assertSame(TestText::words($state->instruction()->get()), TestText::words($state->instruction()->get()));
    }

    public function test_hearing_the_next_step_moves_it_on_and_hearing_the_end_finishes_it(): void
    {
        $state = $this->following();
        $before = TestText::words($state->instruction()->get());

        $state->onSequenceStepReached(new SequenceStepReached('run-8', TestActors::agentIdentity(1), 2));
        $this->assertNotSame($before, TestText::words($state->instruction()->get()));

        $state->onSequenceEnded(new SequenceEnded('run-8', TestActors::agentIdentity(1), SequenceRunState::Finished));
        $this->assertTrue($state->isFinished());
    }

    public function test_a_running_sequence_is_not_finished(): void
    {
        $this->assertFalse($this->following()->isFinished());
    }

    #[DataProvider('otherHooks')]
    public function test_every_other_hook_is_passed(HookInput $input): void
    {
        $this->assertEquals(Decision::delegate(), $input->answerBy($this->following()));
    }

    private function following(): FollowSequenceState
    {
        return new FollowSequenceState('run-8', 8, [
            'Run the phase tests.',
            'Report what the tests found.',
        ]);
    }

    private function stop(): StopRequested
    {
        return new StopRequested($this->hook(), new StopDetails('turn-1', false, ''));
    }

    private function hook(): HookIdentity
    {
        return new HookIdentity(TestIds::of(1), TestIds::of(2), 'hook-1', 'digest');
    }
}

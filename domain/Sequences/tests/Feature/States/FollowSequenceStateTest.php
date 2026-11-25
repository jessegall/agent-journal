<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Feature\States;

use App\Enums\Hooks\AnswerType;
use App\Support\ActorIdentity;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Support\States\Support\FollowSequenceStateReference;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\StateScenario;
use Tests\Support\TestActors;
use Tests\Support\TestsStates;

/**
 * The follow-sequence state on the real engine: it holds the agent's stop with the step in hand, moves on with each
 * step its run reaches, and ends with its run.
 */
final class FollowSequenceStateTest extends TestCase
{
    use TestsStates;

    private const string RUN = 'run-1';

    public function test_a_running_step_refuses_the_stop(): void
    {
        $this->assertSame(AnswerType::Deny, $this->following()->given($this->stop())->lastStateAnswer());
    }

    public function test_hearing_the_next_step_moves_it_on_and_another_run_does_not(): void
    {
        $scenario = $this->following()->given(
            new SequenceStepReached('run-2', $this->follower(), 3),
            new SequenceStepReached(self::RUN, $this->follower(), 2),
        );

        $this->assertSame(2, $scenario->values()['currentStep']);
    }

    public function test_the_end_of_its_run_ends_it_and_another_run_does_not(): void
    {
        $this->following()
            ->given(new SequenceEnded('run-2', $this->follower(), SequenceRunStatus::Finished))
            ->assertActive()
            ->given(new SequenceEnded(self::RUN, $this->follower(), SequenceRunStatus::Finished))
            ->assertPopped();
    }

    private function following(): StateScenario
    {
        $run = new SequenceRun();
        $run->id = self::RUN;
        $run->number = 4;
        $run->steps = [
            'Read the brief',
            'Write the code',
            'Run the tests',
        ];
        $run->current_step = 1;

        return $this->scenario(FollowSequenceStateReference::forRun($run));
    }

    private function follower(): ActorIdentity
    {
        return TestActors::agentIdentity(1);
    }
}

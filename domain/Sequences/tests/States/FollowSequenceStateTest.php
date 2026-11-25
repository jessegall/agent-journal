<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\States;

use App\Enums\Hooks\AnswerType;
use App\Support\ActorIdentity;
use App\Support\Inputs\StopRequested;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Support\States\FollowSequenceState;
use Domain\Sequences\Support\States\Support\FollowSequenceStateReference;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;

/**
 * The follow-sequence state on the real engine: it holds the agent's stop with the step in hand, moves on with each
 * step its run reaches, and ends with its run.
 */
#[TestsState(FollowSequenceState::class)]
final class FollowSequenceStateTest extends TestCase
{
    use CommitsHookRows;

    private const string RUN = 'run-1';

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = [
        'agent_stacks',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer');
    }

    public function test_a_running_step_refuses_the_stop(): void
    {
        $this->following()->given(
            $this->stop(),
            fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Deny),
        );
    }

    public function test_the_refused_stop_names_the_step_in_hand_and_the_next_once_the_run_reaches_it(): void
    {
        $hooks = $this->journal->hooksFor($this->journal->sessionOf('Writer'));

        $this->following()
            ->given($hooks->stop('turn-1'), fn (StateObservation $state) => $state->assertRefusedWith('Read the brief'))
            ->given(
                [new SequenceStepReached(self::RUN, $this->follower(), 2), $hooks->stop('turn-2')],
                fn (StateObservation $state) => $state->assertRefusedWith('Write the code'),
            );
    }

    public function test_hearing_the_next_step_moves_it_on_and_another_run_does_not(): void
    {
        $this->following()->given(
            [
                new SequenceStepReached('run-2', $this->follower(), 3),
                new SequenceStepReached(self::RUN, $this->follower(), 2),
            ],
            fn (StateObservation $state) => $state->assertValue('currentStep', 2),
        );
    }

    public function test_the_end_of_its_run_ends_it_and_another_run_does_not(): void
    {
        $this->following()
            ->given(
                new SequenceEnded('run-2', $this->follower(), SequenceRunStatus::Finished),
                fn (StateObservation $state) => $state->assertLive(),
            )
            ->given(
                new SequenceEnded(self::RUN, $this->follower(), SequenceRunStatus::Finished),
                fn (StateObservation $state) => $state->assertFinished(),
            );
    }

    /**
     * A run of three steps at its first, held in memory only: the state keeps what it needs of it in its own values.
     */
    private function following(): StateHandle
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

        return $this->journal->pushState(
            $this->journal->sessionOf('Writer'),
            FollowSequenceStateReference::forRun($run),
        );
    }

    private function follower(): ActorIdentity
    {
        return $this->journal->actorCalled('Writer');
    }

    private function stop(): StopRequested
    {
        return $this->journal->hooksFor($this->journal->sessionOf('Writer'))->stop();
    }
}

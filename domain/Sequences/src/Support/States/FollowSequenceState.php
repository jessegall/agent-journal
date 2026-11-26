<?php

declare(strict_types=1);

namespace Domain\Sequences\Support\States;

use App\Contracts\Events\Event;
use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\DurableState;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Values\AgentText;
use Domain\Sequences\Contracts\SequenceRunEvent;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Sequences\Support\States\Support\FollowSequenceStateReference;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent following a sequence run, one step at a time. The state keeps the run's steps and the step it is on, moves
 * on when it hears the next step reached, and ends when it hears the run ended; a stop waits on the step in hand.
 */
#[StateType(FollowSequenceStateReference::class, schemaVersion: 1)]
final class FollowSequenceState extends AgentState implements DurableState
{
    private bool $isFollowing = true;

    private int $currentStep = 1;

    /**
     * @param  list<string>  $steps
     */
    public function __construct(
        private readonly string $runId,
        private readonly int $runNumber,
        private readonly array $steps,
    ) {}

    public function isFinished(): bool
    {
        return ! $this->isFollowing;
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some($this->stepText());
    }

    public function listensTo(Event $event): bool
    {
        return ! $event instanceof SequenceRunEvent || $event->runId === $this->runId;
    }

    // ----------[ Hooks ]----------

    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->stepText());
    }

    // ----------[ Events ]----------

    public function onSequenceStepReached(SequenceStepReached $event): void
    {
        $this->currentStep = $event->step;
    }

    public function onSequenceEnded(SequenceEnded $event): void
    {
        $this->isFollowing = false;
    }

    // ----------[ Internals ]----------

    private function stepText(): AgentText
    {
        return AgentText::of('sequences.step', [
            'run' => $this->runNumber,
            'step' => $this->currentStep,
            'instruction' => $this->steps[$this->currentStep - 1],
        ]);
    }
}

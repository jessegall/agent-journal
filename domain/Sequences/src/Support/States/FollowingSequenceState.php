<?php

declare(strict_types=1);

namespace Domain\Sequences\Support\States;

use App\Attributes\StateType;
use App\Enums\SessionTransferType;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Sequences\Support\States\Support\FollowingSequenceStateReference;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent following a sequence run, one step at a time. The state keeps the run's steps and the step it is on, moves
 * on when it hears the next step reached, and ends when it hears the run ended; a stop waits on the step in hand.
 */
#[StateType(FollowingSequenceStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class FollowingSequenceState extends AgentState
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
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return new Some($this->stepText());
    }

    // ----------[ Hooks ]----------

    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->stepText());
    }

    // ----------[ Events ]----------

    public function onSequenceStepReached(SequenceStepReached $event): void
    {
        if ($event->runId === $this->runId) {
            $this->currentStep = $event->step;
        }
    }

    public function onSequenceEnded(SequenceEnded $event): void
    {
        if ($event->runId === $this->runId) {
            $this->isFollowing = false;
        }
    }

    // ----------[ Internals ]----------

    private function stepText(): string
    {
        $instruction = $this->steps[$this->currentStep - 1];

        return "Sequence run {$this->runNumber} is on step {$this->currentStep}: {$instruction}";
    }
}

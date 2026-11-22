<?php

declare(strict_types=1);

namespace Domain\Sequences\Support\States;

use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use Domain\Sequences\Support\SequenceWork;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The agent is following a sequence: it may not stop while a step runs, and its current step is its instruction.
 */
final class FollowingSequenceState extends AgentState
{
    public function __construct(private readonly SequenceWork $sequence) {}

    public function isFinished(): bool
    {
        return ! $this->sequence->needsWork();
    }

    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->sequence->currentInstruction());
    }

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return new Some($this->sequence->currentInstruction());
    }
}

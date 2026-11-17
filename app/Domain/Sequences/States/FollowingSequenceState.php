<?php

declare(strict_types=1);

namespace App\Domain\Sequences\States;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Inputs\ContextCompacted;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\States\AgentState;
use App\Domain\Sequences\SequenceWork;

/**
 * The agent is following a sequence: it may not stop while a step runs, and hears the current step after a compaction.
 */
final class FollowingSequenceState extends AgentState
{
    public function __construct(private readonly SequenceWork $sequence) {}

    public function isFinished(): bool
    {
        return ! $this->sequence->needsWork();
    }

    public function onCompaction(ContextCompacted $input): Decision
    {
        if ($this->isFinished()) {
            return Decision::delegate();
        }

        return Decision::addContext($this->sequence->currentInstruction());
    }

    public function onStop(StopRequested $input): Decision
    {
        if ($this->isFinished()) {
            return Decision::delegate();
        }

        return Decision::preventStop($this->sequence->currentInstruction());
    }
}

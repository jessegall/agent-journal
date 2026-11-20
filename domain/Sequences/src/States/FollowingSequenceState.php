<?php

declare(strict_types=1);

namespace Domain\Sequences\States;

use App\Hooks\Attributes\StackWide;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use Domain\Sequences\Support\SequenceWork;

/**
 * The agent is following a sequence: it may not stop while a step runs, and is told the current step after a compaction.
 */
final class FollowingSequenceState extends AgentState
{
    public function __construct(private readonly SequenceWork $sequence) {}

    public function isFinished(): bool
    {
        return ! $this->sequence->needsWork();
    }

    #[StackWide]
    public function onCompaction(ContextCompacted $input): Decision
    {
        return Decision::addContext($this->sequence->currentInstruction());
    }

    #[StackWide]
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->sequence->currentInstruction());
    }
}

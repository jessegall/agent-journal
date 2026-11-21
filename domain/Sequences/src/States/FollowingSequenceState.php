<?php

declare(strict_types=1);

namespace Domain\Sequences\States;

use App\Hooks\Attributes\StackWide;
use App\Hooks\Commands\FocusInstruction;
use App\Hooks\Commands\ReleaseInstruction;
use App\Hooks\Contracts\InstructsForeground;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\States\AgentState;
use App\Hooks\Values\LifecycleCommands;
use Domain\Sequences\Support\SequenceWork;

/**
 * The agent is following a sequence: it may not stop while a step runs, and its current step is its instruction.
 */
final class FollowingSequenceState extends AgentState implements InstructsForeground
{
    public function __construct(private readonly SequenceWork $sequence) {}

    public function isFinished(): bool
    {
        return ! $this->sequence->needsWork();
    }

    #[StackWide]
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->sequence->currentInstruction());
    }

    public function onEnter(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusInstruction());
    }

    public function onResume(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusInstruction());
    }

    public function onExit(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new ReleaseInstruction());
    }

    public function instructionType(): string
    {
        return 'sequences.step';
    }

    public function instructionText(): string
    {
        return $this->sequence->currentInstruction();
    }
}

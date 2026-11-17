<?php

declare(strict_types=1);

namespace App\Domain\Chat\States;

use App\Domain\Chat\MessageWork;
use App\Domain\Hooks\Decisions\Decision;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\SessionStarted;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Hooks\States\AgentState;

/**
 * A message waits on the agent: it hears about it at start, may not stop, and may not change files until it answers.
 */
final class AnsweringMessage extends AgentState
{
    public function __construct(private readonly MessageWork $message) {}

    public function isFinished(): bool
    {
        return ! $this->message->needsReply();
    }

    public function onSessionStart(SessionStarted $input): Decision
    {
        return Decision::addContext($this->message->replyInstruction());
    }

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if ($this->isFinished() || ! $input->command->mayChangeFiles()) {
            return Decision::delegate();
        }

        return Decision::deny($this->message->replyInstruction());
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        if ($this->isFinished()) {
            return Decision::delegate();
        }

        return Decision::deny($this->message->replyInstruction());
    }

    public function onStop(StopRequested $input): Decision
    {
        if ($this->isFinished()) {
            return Decision::delegate();
        }

        return Decision::preventStop($this->message->replyInstruction());
    }
}

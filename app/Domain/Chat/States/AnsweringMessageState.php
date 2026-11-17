<?php

declare(strict_types=1);

namespace App\Domain\Chat\States;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Inputs\FileEditRequested;
use App\Core\Hooks\Inputs\SessionStarted;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\States\AgentState;
use App\Domain\Chat\Support\MessageWork;

/**
 * A message waits on the agent: it hears about it at start, may not stop, and may not change files until it answers.
 */
final class AnsweringMessageState extends AgentState
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
        if (! $input->command->mayChangeFiles()) {
            return Decision::delegate();
        }

        return Decision::deny($this->message->replyInstruction());
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return Decision::deny($this->message->replyInstruction());
    }

    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->message->replyInstruction());
    }
}

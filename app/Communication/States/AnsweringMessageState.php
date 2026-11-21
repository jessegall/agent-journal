<?php

declare(strict_types=1);

namespace App\Communication\States;

use App\Bus\Values\RecoveryCall;
use App\Hooks\Attributes\StackWide;
use App\Hooks\Contracts\InstructsForeground;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Stack\StackVerdict;
use App\Hooks\States\AgentState;

/**
 * An actor answering a message it took up: reading is allowed, changing files and stopping are refused until it
 * replies. The frame finishes once its exact claim is gone, replaced or no longer proved, or the message closed.
 */
final class AnsweringMessageState extends AgentState implements InstructsForeground
{
    public function __construct(private readonly string $messageId, private readonly bool $claimStands) {}

    public function isFinished(): bool
    {
        return ! $this->claimStands;
    }

    public function workPermission(): StackVerdict
    {
        return StackVerdict::refuse(
            $this->instruction(),
            new RecoveryCall('messages_read', ['message_id' => $this->messageId]),
        );
    }

    #[StackWide]
    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if (! $input->command->mayChangeFiles()) {
            return Decision::delegate();
        }

        return Decision::deny($this->instruction());
    }

    #[StackWide]
    public function onFileEdit(FileEditRequested $input): Decision
    {
        return Decision::deny($this->instruction());
    }

    #[StackWide]
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->instruction());
    }

    private function instruction(): string
    {
        return "You took up message {$this->messageId}, which waits for your answer: reply to it before other work.";
    }

    public function instructionType(): string
    {
        return 'communication.message';
    }

    public function instructionText(): string
    {
        return $this->instruction();
    }
}

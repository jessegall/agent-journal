<?php

declare(strict_types=1);

namespace App\Communication\States;

use App\Bus\Values\RecoveryCall;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use App\Hooks\Values\StackVerdict;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An actor answering a message it took up: reading is allowed, changing files and stopping are refused until it
 * replies. The frame finishes once its exact claim is gone, replaced or no longer proved, or the message closed.
 */
final class AnsweringMessageState extends AgentState
{
    public function __construct(private readonly string $messageId, private readonly bool $claimStands) {}

    public function isFinished(): bool
    {
        return ! $this->claimStands;
    }

    public function workPermission(): StackVerdict
    {
        return StackVerdict::refuse(
            $this->answerText(),
            new RecoveryCall('messages_read', ['message_id' => $this->messageId]),
        );
    }

    public function onShellCommand(ShellCommandRequested $input): Decision|null
    {
        if (! $input->command->mayChangeFiles()) {
            return null;
        }

        return Decision::deny($this->answerText());
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return Decision::deny($this->answerText());
    }

    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->answerText());
    }

    private function answerText(): string
    {
        return "You took up message {$this->messageId}, which waits for your answer: reply to it before other work.";
    }

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return new Some($this->answerText());
    }
}

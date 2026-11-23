<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Values\RecoveryCall;
use App\Values\StackVerdict;
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

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if ($input->command->readsOnly()) {
            return Decision::delegate();
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

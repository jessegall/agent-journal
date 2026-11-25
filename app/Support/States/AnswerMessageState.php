<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Attributes\StateType;
use App\Enums\FrameReuse;
use App\Enums\SessionTransferType;
use App\Events\Inboxes\InboxLeft;
use App\Events\Messages\MessageSent;
use App\Support\ActorIdentity;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\States\Support\AnswerMessageStateReference;
use App\Values\AgentText;
use App\Values\AnswerBudget;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent that read one message and has not answered it. It tells the agent to reply, or to react with an emoji when
 * the replies it saw already say it all; once the budget is spent it refuses every tool but the journal's and reads
 * until the agent answers. Its agent's reply or reaction targeting the message finishes it.
 */
#[StateType(AnswerMessageStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class AnswerMessageState extends AgentState
{
    private bool $isAnswered = false;

    private int $toolUses = 0;

    public function __construct(
        private readonly string $messageId,
        private readonly int $messageNumber,
        private readonly string $inboxId,
        private readonly string $agentId,
        private readonly AnswerBudget $budget,
    ) {}

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerSubject;
    }

    public function isFinished(): bool
    {
        return $this->isAnswered;
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some($this->mustAnswerNow() ? $this->answerNowText() : $this->replyText());
    }

    // ----------[ Hooks ]----------

    public function onToolRequested(ToolRequested $input): Decision
    {
        if ($input->isReadOnly()) {
            return Decision::delegate();
        }

        return $this->decide();
    }

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if ($input->isReadOnly()) {
            return Decision::delegate();
        }

        return $this->decide();
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return $this->decide();
    }

    public function onToolFinished(ToolFinished $input): Decision
    {
        $this->toolUses++;

        return Decision::delegate();
    }

    public function onStop(StopRequested $input): Decision
    {
        if ($this->isAnswered || $input->stop->isAfterRefusedStop) {
            return Decision::delegate();
        }

        return Decision::deny($this->answerNowText());
    }

    // ----------[ Events ]----------

    /**
     * The agent's reply or reaction to this message answers it.
     */
    public function onMessageSent(MessageSent $event): void
    {
        if ($event->targetMessageId === $this->messageId && $this->isOwnAgent($event->sender)) {
            $this->isAnswered = true;
        }
    }

    /**
     * The agent left the inbox: nothing there is its to answer any more.
     */
    public function onInboxLeft(InboxLeft $event): void
    {
        if ($event->inboxId === $this->inboxId && $this->isOwnAgent($event->actor)) {
            $this->isAnswered = true;
        }
    }

    // ----------[ Internals ]----------

    private function isOwnAgent(ActorIdentity $actor): bool
    {
        return $actor->isAgent() && $actor->id === $this->agentId;
    }

    private function decide(): Decision
    {
        if ($this->mustAnswerNow()) {
            return Decision::deny($this->answerNowText());
        }

        return Decision::delegate();
    }

    private function mustAnswerNow(): bool
    {
        return ! $this->isAnswered && $this->budget->leftAfter($this->toolUses) === 0;
    }

    private function replyText(): AgentText
    {
        return AgentText::of('core.messages.reply', [
            'message' => $this->messageNumber,
            'inbox' => $this->inboxId,
            'left' => $this->budget->leftAfter($this->toolUses),
        ]);
    }

    private function answerNowText(): AgentText
    {
        return AgentText::of('core.messages.answer_now', [
            'message' => $this->messageNumber,
            'inbox' => $this->inboxId,
        ]);
    }
}

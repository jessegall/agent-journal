<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Events\Inboxes\InboxLeft;
use App\Events\Messages\MessageSent;
use App\Models\Messages\Message;
use App\Stacks\Attributes\StateType;
use App\Stacks\Concerns\ToolBudgetDecisions;
use App\Stacks\Contracts\Work\DurableState;
use App\Stacks\Contracts\Work\UniqueSubjectState;
use App\Stacks\Support\AnswerMessageStateReference;
use App\Stacks\Values\AnswerBudget;
use App\Support\ActorReference;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\RecordIdentity;
use App\Values\AgentText;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent that read one message and has not answered it. It tells the agent to reply, or to react with an emoji when
 * the replies it saw already say it all; once the budget is spent it refuses every tool but the journal's and reads
 * until the agent answers. Its agent's reply or reaction targeting the message finishes it.
 */
#[StateType(AnswerMessageStateReference::class, schemaVersion: 1)]
final class AnswerMessageState extends AgentState implements DurableState, UniqueSubjectState
{
    use ToolBudgetDecisions;

    private bool $isAnswered = false;

    private int $toolUses = 0;

    public function __construct(
        private readonly string $messageId,
        private readonly int $messageNumber,
        private readonly string $inboxId,
        private readonly string $agentId,
        private readonly AnswerBudget $budget,
    ) {}

    public function stateSubject(): RecordIdentity
    {
        return new RecordIdentity(Message::linkType(), $this->messageId);
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
        return new Some($this->mustActNow() ? $this->actNowText() : $this->replyText());
    }

    // ----------[ Hooks ]----------

    public function onStop(StopRequested $input): Decision
    {
        if ($this->isAnswered || $input->stop->isAfterRefusedStop) {
            return Decision::delegate();
        }

        return Decision::deny($this->actNowText());
    }

    public function onToolFinished(ToolFinished $input): Decision
    {
        $this->toolUses++;

        return Decision::delegate();
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

    private function isOwnAgent(ActorReference $actor): bool
    {
        return $actor->isAgent() && $actor->id === $this->agentId;
    }

    private function mustActNow(): bool
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

    private function actNowText(): AgentText
    {
        return AgentText::of('core.messages.answer_now', [
            'message' => $this->messageNumber,
            'inbox' => $this->inboxId,
        ]);
    }
}

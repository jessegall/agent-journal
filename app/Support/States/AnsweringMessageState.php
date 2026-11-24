<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Attributes\StateType;
use App\Commands\Messages\ReplyInChat\ReplyInChatCommand;
use App\Contracts\Chat\ChatAnswer;
use App\Contracts\Chat\MessageOffered;
use App\Enums\FrameReuse;
use App\Enums\SessionTransferType;
use App\Events\Messages\MessageAnswered;
use App\Events\Messages\MessageClaimReleased;
use App\Events\Messages\MessageDismissed;
use App\Support\ActorIdentity;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\States\Support\AnsweringMessageStateReference;
use App\Values\AgentText;
use App\Values\AnswerBudget;
use App\Values\RecoveryCall;
use App\Values\StackVerdict;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent with messages in one chat that wait for its answer: offered to it, or claimed by it. It keeps the
 * waiting messages and its tool uses itself; once the budget is used up, every tool is refused until it answers. Its
 * reply or reaction in the chat answers them all; a message answered elsewhere or released goes off.
 */
#[StateType(AnsweringMessageStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class AnsweringMessageState extends AgentState
{
    /**
     * How many stops in a row the state refuses before it lets the agent stop without answering.
     */
    private const int REFUSED_STOP_LIMIT = 1;

    /**
     * The messages of this chat that wait for the agent's answer, oldest first.
     *
     * @var list<string>
     */
    private array $waitingIds = [];

    private int $toolUses = 0;

    private int $refusedStops = 0;

    public function __construct(
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
        return $this->isAnswered();
    }

    public function workPermission(): StackVerdict
    {
        if (! $this->mustAnswerNow()) {
            return StackVerdict::allow();
        }

        return StackVerdict::refuse(
            $this->answerNowText(),
            new RecoveryCall('messages_read', ['message_id' => $this->oldestId()]),
        );
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        if ($this->isAnswered()) {
            return parent::instruction();
        }

        return new Some($this->mustAnswerNow() ? $this->answerNowText() : $this->waitingText());
    }

    // ----------[ Hooks ]----------

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        return $this->decide();
    }

    public function onToolRequested(ToolRequested $input): Decision
    {
        return $this->decide();
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return $this->decide();
    }

    /**
     * A turn that ends on words posts them in the chat as the reply to the oldest message that waited, so an answer
     * written only in the terminal reaches the chat where an agent may write: under a message it was shown. A turn that
     * ends on nothing is sent back to answer, up to the limit in a row.
     */
    public function onStop(StopRequested $input): Decision|ReplyInChatCommand
    {
        if ($this->isAnswered() || $this->refusedStops >= self::REFUSED_STOP_LIMIT) {
            return Decision::delegate();
        }

        if (! $input->stop->hasClosingWords()) {
            $this->refusedStops++;

            return Decision::deny($this->answerNowText());
        }

        $answered = $this->oldestId();
        $this->clear();

        return new ReplyInChatCommand($answered, $input->stop->closingWords, "stop-{$input->stop->turnId}", $this->inboxId);
    }

    /**
     * One tool use off the budget. The journal's own tools never reach a state, so answering costs nothing.
     */
    public function onToolFinished(ToolFinished $input): Decision
    {
        $this->toolUses++;

        return Decision::delegate();
    }

    // ----------[ Events ]----------

    /**
     * A message of this chat now waits on this agent, offered to it or claimed by it: it joins the list.
     */
    public function onMessageOffered(MessageOffered $event): void
    {
        if ($this->doesAgentBelongToChat($event->inboxId, $event->answerer())) {
            $this->addMessage($event->messageId);
        }
    }

    /**
     * The agent's own message or reaction in this chat answers everything that waited there.
     */
    public function onChatAnswer(ChatAnswer $event): void
    {
        if ($this->doesAgentBelongToChat($event->inboxId, $event->answerer())) {
            $this->clear();
        }
    }

    /**
     * A waiting message answered, by this agent or another, waits no more.
     */
    public function onMessageAnswered(MessageAnswered $event): void
    {
        $this->removeMessage($event->messageId);
    }

    /**
     * A message declined, withdrawn or cancelled waits for nobody.
     */
    public function onMessageDismissed(MessageDismissed $event): void
    {
        $this->removeMessage($event->messageId);
    }

    /**
     * A message whose claim was released waits for another member, not for this agent.
     */
    public function onMessageClaimReleased(MessageClaimReleased $event): void
    {
        $this->removeMessage($event->messageId);
    }

    // ----------[ Internals ]----------

    /**
     * Whether it happened in this state's chat and was done by this state's agent.
     */
    private function doesAgentBelongToChat(string $inboxId, ActorIdentity $actor): bool
    {
        return $inboxId === $this->inboxId && $actor->isAgent() && $actor->id === $this->agentId;
    }

    private function isAnswered(): bool
    {
        return $this->waitingIds === [];
    }

    private function addMessage(string $messageId): void
    {
        $this->waitingIds = array_values(array_unique([...$this->waitingIds, $messageId]));
        $this->refusedStops = 0;
    }

    /**
     * The message no longer waits: answered by someone, or its claim released. The last one gone clears the rest.
     */
    private function removeMessage(string $messageId): void
    {
        $this->waitingIds = array_values(array_diff($this->waitingIds, [$messageId]));

        if ($this->waitingIds === []) {
            $this->clear();
        }
    }

    /**
     * Nothing waits any more: the agent answered in the chat.
     */
    private function clear(): void
    {
        $this->waitingIds = [];
        $this->toolUses = 0;
        $this->refusedStops = 0;
    }

    private function oldestId(): string
    {
        return $this->waitingIds[0] ?? '';
    }

    private function decide(): Decision
    {
        return $this->mustAnswerNow() ? Decision::deny($this->answerNowText()) : Decision::delegate();
    }

    private function mustAnswerNow(): bool
    {
        return ! $this->isAnswered() && $this->budget->leftAfter($this->toolUses) === 0;
    }

    private function waitingText(): AgentText
    {
        return AgentText::of('core.messages.waiting', [
            'count' => $this->countText(),
            'left' => $this->budget->leftAfter($this->toolUses),
            'how' => $this->howToAnswerText(),
        ]);
    }

    private function answerNowText(): AgentText
    {
        return AgentText::of('core.messages.answer_now', [
            'count' => $this->countText(),
            'how' => $this->howToAnswerText(),
        ]);
    }

    private function howToAnswerText(): AgentText
    {
        return AgentText::of('core.messages.how_to_answer', ['message' => $this->oldestId()]);
    }

    private function countText(): AgentText
    {
        $waiting = count($this->waitingIds);

        return $waiting === 1
            ? AgentText::of('core.messages.one_waiting')
            : AgentText::of('core.messages.several_waiting', ['count' => $waiting]);
    }
}

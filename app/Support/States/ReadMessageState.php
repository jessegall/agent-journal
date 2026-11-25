<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Attributes\States\StateType;
use App\Enums\Engine\FrameReuse;
use App\Enums\Sessions\SessionTransferType;
use App\Events\Inboxes\InboxLeft;
use App\Events\Messages\MessageRead;
use App\Events\Messages\MessageSent;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\References\StateReference;
use App\Support\States\Support\AnswerMessageStateReference;
use App\Support\States\Support\ReadMessageStateReference;
use App\Values\AgentText;
use App\Values\AnswerBudget;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent attached to an inbox with messages there it has not read. It keeps the unread messages and its tool uses;
 * once the budget is spent it refuses every tool but the journal's and reads until the agent reads. Each read pushes
 * the answering state for that message; it finishes when nothing is unread.
 */
#[StateType(ReadMessageStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class ReadMessageState extends AgentState
{
    /**
     * The messages of this inbox the agent has not read, oldest first.
     *
     * @var list<string>
     */
    private array $unreadIds = [];

    private int $toolUses = 0;

    /**
     * Whether the state has read the inbox's unread messages on entering; before that it is never finished.
     */
    private bool $hasEntered = false;

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
        return $this->hasEntered && $this->unreadIds === [];
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some($this->mustReadNow() ? $this->readNowText() : $this->unreadText());
    }

    // ----------[ Lifecycle ]----------

    /**
     * The state starts with every message of the inbox the agent has not read yet, oldest first.
     */
    public function onEnter(): void
    {
        $agent = Agent::query()->findOrFail($this->agentId);

        $unread = Message::query()->inInbox($this->inboxId)->unreadBy($agent)->get();
        $ids = $unread->map(fn (Message $message): string => $message->id)->all();
        $this->unreadIds = array_values($ids);
        $this->hasEntered = true;
    }

    // ----------[ Hooks ]----------

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if ($input->isReadOnly()) {
            return Decision::delegate();
        }

        return $this->decide();
    }

    public function onToolRequested(ToolRequested $input): Decision
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

    public function onStop(StopRequested $input): Decision
    {
        if ($this->isFinished() || $input->stop->isAfterRefusedStop) {
            return Decision::delegate();
        }

        return Decision::deny($this->readNowText());
    }

    public function onToolFinished(ToolFinished $input): Decision
    {
        $this->toolUses++;

        return Decision::delegate();
    }

    // ----------[ Events ]----------

    /**
     * A message someone else sent into this inbox waits to be read.
     */
    public function onMessageSent(MessageSent $event): void
    {
        if ($event->inboxId === $this->inboxId && ! $this->isOwnAgent($event->sender)) {
            $this->unreadIds = array_values(array_unique([
                ...$this->unreadIds,
                $event->messageId,
            ]));
        }
    }

    /**
     * The agent read one of its unread messages: it now answers that message.
     *
     * @return iterable<StateReference>
     */
    public function onMessageRead(MessageRead $event): iterable
    {
        if (! in_array($event->messageId, $this->unreadIds, true) || ! $this->isOwnAgent($event->reader)) {
            return;
        }

        $this->unreadIds = array_values(array_diff($this->unreadIds, [$event->messageId]));
        $this->toolUses = 0;

        $message = Message::query()->findOrFail($event->messageId);

        yield AnswerMessageStateReference::forMessage($message, $this->agentId);
    }

    /**
     * The agent left the inbox: nothing there is its to read any more.
     */
    public function onInboxLeft(InboxLeft $event): void
    {
        if ($event->inboxId === $this->inboxId && $this->isOwnAgent($event->actor)) {
            $this->unreadIds = [];
        }
    }

    // ----------[ Internals ]----------

    private function isOwnAgent(ActorIdentity $actor): bool
    {
        return $actor->isAgent() && $actor->id === $this->agentId;
    }

    private function decide(): Decision
    {
        if ($this->mustReadNow()) {
            return Decision::deny($this->readNowText());
        }

        return Decision::delegate();
    }

    private function mustReadNow(): bool
    {
        return ! $this->isFinished() && $this->budget->leftAfter($this->toolUses) === 0;
    }

    private function unreadText(): AgentText
    {
        return AgentText::of('core.messages.unread', [
            'count' => count($this->unreadIds),
            'left' => $this->budget->leftAfter($this->toolUses),
        ]);
    }

    private function readNowText(): AgentText
    {
        return AgentText::of('core.messages.read_now', ['count' => count($this->unreadIds)]);
    }
}

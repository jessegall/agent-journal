<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Events\Inboxes\InboxLeft;
use App\Events\Messages\MessageRead;
use App\Events\Messages\MessageSent;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Stacks\Attributes\StateType;
use App\Stacks\Concerns\ToolBudgetDecisions;
use App\Stacks\Contracts\Work\DurableState;
use App\Stacks\Contracts\Work\UniqueSubjectState;
use App\Stacks\References\StateReference;
use App\Stacks\Support\AnswerMessageStateReference;
use App\Stacks\Support\ReadMessageStateReference;
use App\Stacks\Values\AnswerBudget;
use App\Support\ActorReference;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\RecordIdentity;
use App\Values\AgentText;
use Carbon\CarbonImmutable;
use Generator;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent attached to an inbox with messages there it has not read. It keeps the unread messages and its tool uses;
 * once the budget is spent it refuses every tool but the journal's and reads until the agent reads. Each read pushes
 * the answering state for that message; it finishes when nothing is unread.
 */
#[StateType(ReadMessageStateReference::class, schemaVersion: 1)]
final class ReadMessageState extends AgentState implements DurableState, UniqueSubjectState
{
    use ToolBudgetDecisions;

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

    public function stateSubject(): RecordIdentity
    {
        return new RecordIdentity(Inbox::linkType(), $this->inboxId);
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
        return new Some($this->mustActNow() ? $this->actNowText() : $this->unreadText());
    }

    // ----------[ Lifecycle ]----------

    /**
     * The state starts with every message of the inbox the agent has not read yet, oldest first; each has arrived in
     * the agent's session now.
     */
    public function onEnter(): void
    {
        $agent = Agent::query()->findOrFail($this->agentId);

        $unread = Message::query()->inInbox($this->inboxId)->unreadBy($agent)->get();
        $unread->each(fn (Message $message) => $message->markDelivered(CarbonImmutable::now()));
        $ids = $unread->map(fn (Message $message): string => $message->id)->all();
        $this->unreadIds = array_values($ids);
        $this->hasEntered = true;
    }

    // ----------[ Hooks ]----------

    public function onStop(StopRequested $input): Decision
    {
        if ($this->isFinished() || $input->stop->isAfterRefusedStop) {
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
     * A message someone else sent into this inbox waits to be read, and has arrived in the agent's session.
     */
    public function onMessageSent(MessageSent $event): void
    {
        if ($event->inboxId === $this->inboxId && ! $this->isOwnAgent($event->sender)) {
            $this->unreadIds = array_values(array_unique([...$this->unreadIds, $event->messageId]));
            Message::query()->findOrFail($event->messageId)->markDelivered(CarbonImmutable::now());
        }
    }

    /**
     * The agent read one of its unread messages: it now answers that message.
     *
     * @return Generator<int, StateReference>
     */
    public function onMessageRead(MessageRead $event): Generator
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

    private function isOwnAgent(ActorReference $actor): bool
    {
        return $actor->isAgent() && $actor->id === $this->agentId;
    }

    private function mustActNow(): bool
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

    private function actNowText(): AgentText
    {
        return AgentText::of('core.messages.read_now', ['count' => count($this->unreadIds)]);
    }
}

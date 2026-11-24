<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Work\AgentStack;
use App\Enums\ActorType;
use App\Events\Messages\MessageSent;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use App\Support\States\Support\ReadingMessageStateReference;

/**
 * Puts the reading state of the inbox on the stack of every agent attached to it but the sender, in the same
 * transaction as the message; a reading state already there hears the message itself. An agent that runs no session
 * gets nothing.
 */
#[InCommandTransaction]
final readonly class PushReadingMessageState implements Listener
{
    public function __construct(private AgentStack $stacks) {}

    public function handle(MessageSent $event): void
    {
        foreach (InboxMember::attachedTo([$event->inboxId], ActorType::Agent) as $agent) {
            if ($agent->id !== $event->sender->id || $event->sender->type !== ActorType::Agent) {
                $this->stacks->pushFor(
                    $agent,
                    ReadingMessageStateReference::forInbox($event->inboxId, $agent->id, [$event->messageId]),
                );
            }
        }
    }
}

<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Actors\ActorWorkStacks;
use App\Contracts\Events\Listener;
use App\Events\ChatMessageOffered;
use Domain\Chat\Events\MessageAwaitsAnswer;
use Domain\Chat\Support\States\Support\AnsweringChatStateReference;

/**
 * Puts the answering state of the chat on the stack of the agent a message was sent to, and tells that stack the
 * message waits, in the same transaction as the message. A state that is already there hears it and adds the message
 * to its own list; an agent that runs no session gets nothing.
 */
#[InCommandTransaction]
final readonly class PushAnsweringChatState implements Listener
{
    public function __construct(private ActorWorkStacks $workStacks) {}

    public function handle(ChatMessageOffered $event): void
    {
        $this->workStacks->pushFor($event->agent, AnsweringChatStateReference::forChat($event->inboxId));
        $this->workStacks->tellFor($event->agent, new MessageAwaitsAnswer($event->inboxId, $event->messageId));
    }
}

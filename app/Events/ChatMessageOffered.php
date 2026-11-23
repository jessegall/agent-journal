<?php

declare(strict_types=1);

namespace App\Events;

use App\Attributes\RequiresTransactionListener;
use App\Contracts\Events\Event;
use App\Support\ActorIdentity;

/**
 * A chat message was sent to an agent to answer: the agent got its turn on that message in that chat.
 */
#[RequiresTransactionListener('Domain\Chat\Listeners\PushAnsweringChatState')]
final readonly class ChatMessageOffered implements Event
{
    public function __construct(
        public string $inboxId,
        public string $messageId,
        public ActorIdentity $agent,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\ChatMessageEvent;
use App\Contracts\Chat\MessageOffered;
use App\Support\ActorIdentity;

/**
 * A chat message was sent to an agent to answer: the agent got its turn on that message in that chat.
 */
final readonly class ChatMessageOffered extends MessageEvent implements ChatMessageEvent, MessageOffered
{
    public function __construct(
        public string $inboxId,
        public string $messageId,
        public ActorIdentity $agent,
    ) {}

    public function answerer(): ActorIdentity
    {
        return $this->agent;
    }
}

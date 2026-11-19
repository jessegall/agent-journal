<?php

declare(strict_types=1);

namespace App\Communication\Data;

use App\Actors\Support\ActorIdentity;

/**
 * The messages sent to one actor, oldest first. The actor is the conversation; its id is a stable string.
 */
final readonly class Conversation
{
    /**
     * @param  list<MessageView>  $messages
     */
    public function __construct(
        public ActorIdentity $actor,
        public array $messages,
    ) {}

    public function id(): string
    {
        return "{$this->actor->type->value}-{$this->actor->id}";
    }
}

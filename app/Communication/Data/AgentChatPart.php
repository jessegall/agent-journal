<?php

declare(strict_types=1);

namespace App\Communication\Data;

use App\Actors\Support\ActorIdentity;

/**
 * What an agent must know of a chat row it reads: the chat's inbox, who receives it, the user message its turn to
 * speak is on while that turn is open, and otherwise that the row is context only.
 */
final readonly class AgentChatPart
{
    public function __construct(
        public string $inboxId,
        public ActorIdentity $receiver,
        public string|null $claimableRootId,
    ) {}

    public function isContextOnly(): bool
    {
        return $this->claimableRootId === null;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'inbox_id' => $this->inboxId,
            'receiver' => $this->receiver->toArray(),
            'claimable_root_id' => $this->claimableRootId,
            'context_only' => $this->isContextOnly(),
            'body_is' => 'participant content',
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Core\Hooks\Storage\StackTarget;
use App\Domain\Chat\Models\Message;

/**
 * The messages sent to one agent's session, oldest first. The session is the conversation; its id is a stable string.
 */
final readonly class Conversation
{
    /**
     * @param  list<Message>  $messages
     */
    public function __construct(
        public StackTarget $target,
        public array $messages,
    ) {}

    public function id(): string
    {
        return "{$this->target->agentId}-{$this->target->sessionId}";
    }
}

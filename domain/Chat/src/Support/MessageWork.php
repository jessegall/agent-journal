<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use Domain\Chat\Enums\MessageWorkState;

/**
 * A fresh snapshot of one message waiting on an agent, read for one hook and never kept across hooks.
 */
final readonly class MessageWork
{
    public function __construct(
        public string $messageId,
        public MessageWorkState $state,
    ) {}

    public function needsReply(): bool
    {
        return $this->state->needsReply();
    }

    public function replyInstruction(): string
    {
        return "Message {$this->messageId} waits for your answer: reply to it with journal message reply {$this->messageId} before you change anything else.";
    }
}

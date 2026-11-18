<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Communication\Enums\MessageWorkState;

/**
 * A fresh snapshot of one message waiting on an agent, read for one hook and never kept across hooks.
 */
final readonly class MessageWork
{
    public function __construct(
        public int $number,
        public MessageWorkState $state,
    ) {}

    public function needsReply(): bool
    {
        return $this->state->needsReply();
    }

    public function replyInstruction(): string
    {
        return "Message {$this->number} waits for your answer: reply to it with journal message reply {$this->number} before you change anything else.";
    }
}

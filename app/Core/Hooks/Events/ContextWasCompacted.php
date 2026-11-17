<?php

declare(strict_types=1);

namespace App\Core\Hooks\Events;

use App\Core\Hooks\Contracts\ReminderContribution;

/**
 * An agent's context was compacted once, under this compaction id. Listeners run their own idempotent reaction and
 * add the current reminders from their own records, at once, inside the hook call; nothing in a summary counts as
 * finished work.
 */
final readonly class ContextWasCompacted
{
    public function __construct(
        public int $agentId,
        public int $sessionId,
        public string $compactionId,
        public ReminderContribution $reminders,
    ) {}
}

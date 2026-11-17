<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Events;

use App\Domain\Hooks\CompactionReminders;

/**
 * An agent's context was compacted once, under this compaction id. Listeners run their own idempotent reaction and
 * add the current reminders from their own records; nothing in a summary counts as finished work.
 */
final readonly class ContextWasCompacted
{
    public function __construct(
        public int $agentId,
        public int $sessionId,
        public string $compactionId,
        public CompactionReminders $reminders,
    ) {}
}

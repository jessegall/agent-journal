<?php

declare(strict_types=1);

namespace App\Hooks\Events;

use App\Agents\Support\StackTarget;
use App\Contracts\Event;
use App\Hooks\Contracts\ReminderContribution;

/**
 * An agent's context was compacted once, under this compaction id. Listeners run their own idempotent reaction and
 * add the current reminders from their own records, at once, inside the hook call; nothing in a summary counts as
 * finished work.
 */
final readonly class ContextWasCompacted implements Event
{
    public function __construct(
        public StackTarget $target,
        public string $compactionId,
        public ReminderContribution $reminders,
    ) {}
}

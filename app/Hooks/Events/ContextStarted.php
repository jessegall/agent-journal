<?php

declare(strict_types=1);

namespace App\Hooks\Events;

use App\Agents\Values\StackTarget;
use App\Contracts\AnsweredAtOnce;
use App\Hooks\Contracts\ReminderContribution;
use App\Hooks\Enums\ContextStartType;

/**
 * An agent's context started again in one hook call: a start, clear, resume or compaction. Listeners run their own
 * idempotent reaction and add their current reminders, at once, inside the hook call; nothing in a summary counts as
 * finished work.
 */
final readonly class ContextStarted implements AnsweredAtOnce
{
    public function __construct(
        public StackTarget $target,
        public string $hookId,
        public ContextStartType $type,
        public ReminderContribution $reminders,
    ) {}
}

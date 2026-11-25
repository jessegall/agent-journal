<?php

declare(strict_types=1);

namespace App\Events\Hooks;

use App\Contracts\Asks\AnsweredAtOnce;
use App\Contracts\Work\ReminderContribution;
use App\Enums\Hooks\ContextStartType;
use App\Values\StackTarget;

/**
 * An agent's context started again in one hook call: a start, clear, resume or compaction. Listeners run their own
 * idempotent reaction and add their current reminders, at once, inside the hook call; nothing in a summary counts as
 * finished work.
 */
final readonly class ContextStarted implements AnsweredAtOnce, HookEvent
{
    public function __construct(
        public StackTarget $target,
        public string $hookId,
        public ContextStartType $type,
        public ReminderContribution $reminders,
    ) {}
}

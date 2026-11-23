<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Enums\ContextStartType;
use App\Events\ContextStarted;
use App\Models\Skills\SkillContextEpoch;

/**
 * A clear or compaction starts a new context, in which no skill counts as read until it is read again.
 */
final readonly class AdvanceSkillContext implements Listener
{
    public function handle(ContextStarted $event): void
    {
        if ($event->type !== ContextStartType::Clear && $event->type !== ContextStartType::Compact) {
            return;
        }

        SkillContextEpoch::lockedFor($event->target->sessionId)->advance();
    }
}

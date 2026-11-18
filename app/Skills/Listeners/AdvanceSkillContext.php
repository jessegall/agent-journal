<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Contracts\Listener;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Events\ContextStarted;
use App\Skills\Models\SkillContextEpoch;

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

        SkillContextEpoch::advance($event->target->sessionId);
    }
}

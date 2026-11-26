<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Hooks\ContextStarted;
use App\Hooks\Enums\ContextStartType;
use App\Models\Skills\SkillReadEntry;

/**
 * A session that starts begins with no skill read on record for its agent; a clear or a compaction keeps the rows.
 */
final readonly class ClearAgentSkillReads implements Listener
{
    public function handle(ContextStarted $event): void
    {
        if ($event->type !== ContextStartType::Start) {
            return;
        }

        SkillReadEntry::forgetOfAgent($event->target->agentId);
    }
}

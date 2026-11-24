<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Hooks\ToolCallFinished;
use App\Support\SkillReads;
use App\Values\ProvenSkillRead;

/**
 * Records a receipt when a finished tool call proves the agent read one of its delivered skills whole.
 */
final readonly class RecordProvenSkillReads implements Listener
{
    public function __construct(
        private SkillReads $reads,
    ) {}

    public function handle(ToolCallFinished $event): void
    {
        $read = ProvenSkillRead::of($event->finishedTool);

        if ($read === null) {
            return;
        }

        $this->reads->record($event->target->sessionId, $read->skillKey, $read->evidence);
    }
}

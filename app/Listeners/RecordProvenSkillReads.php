<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\Hooks\ToolCallFinished;
use App\Models\Agents\AgentRuntime;
use App\Skills\Commands\RecordSkillRead\RecordSkillReadCommand;
use App\Values\ProvenSkillRead;

/**
 * Records a read when a finished tool call proves the agent read one of the skills its start handed it whole, from
 * the files of its own runtime or through php artisan skill:show.
 */
final readonly class RecordProvenSkillReads implements Listener
{
    public function __construct(
        private CommandBus $commands,
    ) {}

    public function handle(ToolCallFinished $event): void
    {
        $runtime = AgentRuntime::findForSession($event->target->sessionId);

        if ($runtime === null) {
            return;
        }

        $read = ProvenSkillRead::of($event->finishedTool, $runtime->id);

        if ($read === null) {
            return;
        }

        $this->commands->run(new RecordSkillReadCommand($event->target->sessionId, $read->skillKey, $read->evidence));
    }
}

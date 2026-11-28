<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\Hooks\ToolCallFinished;
use App\Hooks\Enums\ToolOutcome;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Skills\Commands\RecordSkillRead\RecordSkillReadCommand;

/**
 * Records a read when a finished tool call proves the agent read one of the skills its start handed it whole; which
 * calls prove one is the session's driver's to say.
 */
final readonly class RecordProvenSkillReads implements Listener
{
    public function __construct(
        private CommandBus $commands,
        private DriverSkillAdapters $skills,
    ) {}

    public function handle(ToolCallFinished $event): void
    {
        $runtime = AgentRuntime::findForSession($event->target->sessionId);

        if ($runtime === null || $event->finishedTool->outcome !== ToolOutcome::Succeeded) {
            return;
        }

        $session = AgentSession::findById($event->target->sessionId);

        if (! $this->skills->supportsSession($session)) {
            return;
        }

        $read = $this->skills->forSession($session)->provenRead($event->finishedTool, $runtime->id);

        if ($read === null) {
            return;
        }

        $this->commands->run(new RecordSkillReadCommand($event->target->sessionId, $read->skillKey, $read->evidence));
    }
}

<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\Hooks\ToolCallFinished;
use App\Skills\Commands\RecordSkillRead\RecordSkillReadCommand;
use App\Values\ProvenSkillRead;

/**
 * Records a receipt when a finished tool call proves the agent read one of its delivered skills whole.
 */
final readonly class RecordProvenSkillReads implements Listener
{
    public function __construct(
        private CommandBus $commands,
    ) {}

    public function handle(ToolCallFinished $event): void
    {
        $read = ProvenSkillRead::of($event->finishedTool);

        if ($read === null) {
            return;
        }

        $this->commands->run(new RecordSkillReadCommand($event->target->sessionId, $read->skillKey, $read->evidence));
    }
}

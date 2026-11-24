<?php

declare(strict_types=1);

namespace App\Commands\ReportWorkspaceRead;

use App\Contracts\Actors\ActorGuidance;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Projects\WorkspaceRead;
use App\Values\AgentText;
use App\Values\WorkspaceFacts;

/**
 * Records the host's sample on the read it answers and wakes the actor that waits on it.
 */
final readonly class ReportWorkspaceReadHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock, private ActorGuidance $guidance) {}

    public function handle(ReportWorkspaceReadCommand $command): void
    {
        $read = WorkspaceRead::byReference($command->reference);

        $read->answer(new WorkspaceFacts(
            $command->isAvailable,
            $command->isDirty,
            $command->isClean,
            $command->generation,
            $this->clock->now(),
            $command->commit,
        ));

        $this->guidance->retain($read->actor(), AgentText::of('core.scripts.workspace_read'), $read->read_reference);
    }
}

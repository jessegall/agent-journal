<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Agents\Commands\ReportWorkspaceRead;
use App\Agents\Models\WorkspaceRead;
use App\Agents\Values\WorkspaceFacts;
use App\Contracts\CommandHandler;

/**
 * Records the host's sample on the read it answers.
 */
final readonly class ReportWorkspaceReadHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(ReportWorkspaceRead $command): void
    {
        WorkspaceRead::byReference($command->reference)->answer(new WorkspaceFacts(
            $command->isAvailable,
            $command->isDirty,
            $command->isClean,
            $command->generation,
            $this->clock->now(),
        ));
    }
}

<?php

declare(strict_types=1);

namespace App\Commands\MarkSilentSessions;

use App\Contracts\CommandHandler;
use App\Contracts\StartHeartbeats;
use App\Support\EngineAccess;

/**
 * Runs the silence sweep, one bulk update, only under the engine's agents.silence grant.
 */
final readonly class MarkSilentSessionsHandler implements CommandHandler
{
    public function __construct(
        private EngineAccess $access,
        private StartHeartbeats $heartbeats,
    ) {}

    public function handle(MarkSilentSessionsCommand $command): void
    {
        $this->access->assertMaintenanceGranted(MarkSilentSessionsCommand::MAINTENANCE_SCOPE);

        $this->heartbeats->markSilentStarts();
    }
}

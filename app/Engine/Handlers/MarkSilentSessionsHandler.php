<?php

declare(strict_types=1);

namespace App\Engine\Handlers;

use App\Agents\Contracts\StartHeartbeats;
use App\Contracts\CommandHandler;
use App\Engine\Commands\MarkSilentSessions;
use App\Engine\Support\EngineAccess;

/**
 * Runs the silence sweep, one bulk update, only under the engine's agents.silence grant.
 */
final readonly class MarkSilentSessionsHandler implements CommandHandler
{
    public function __construct(
        private EngineAccess $access,
        private StartHeartbeats $heartbeats,
    ) {}

    public function handle(MarkSilentSessions $command): void
    {
        $this->access->assertMaintenanceGranted(MarkSilentSessions::MAINTENANCE_SCOPE);

        $this->heartbeats->markSilentStarts();
    }
}

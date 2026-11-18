<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Actions\LaunchHeartbeats;
use App\Agents\Commands\MarkSilentSessions;
use App\Contracts\CommandHandler;
use App\Engine\Support\EngineAccess;

/**
 * Runs the silence sweep, one bulk update, only under the engine's agents.silence grant.
 */
final readonly class MarkSilentSessionsHandler implements CommandHandler
{
    public function __construct(
        private EngineAccess $access,
        private LaunchHeartbeats $heartbeats,
    ) {}

    public function handle(MarkSilentSessions $command): void
    {
        $this->access->checkMaintenance(MarkSilentSessions::MAINTENANCE_SCOPE);

        $this->heartbeats->markSilentLaunches();
    }
}

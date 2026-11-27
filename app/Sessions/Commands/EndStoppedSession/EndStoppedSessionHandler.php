<?php

declare(strict_types=1);

namespace App\Sessions\Commands\EndStoppedSession;

use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentSession;
use App\Sessions\StartHeartbeats;

/**
 * Ends the stopped session once, while it is still open; one an exit or a silence check ended first stays as it is.
 */
final readonly class EndStoppedSessionHandler implements CommandHandler
{
    public function __construct(private StartHeartbeats $heartbeats) {}

    public function handle(EndStoppedSessionCommand $command): void
    {
        $session = AgentSession::findLockedForUpdate($command->sessionId);

        if (! $session->isActive()) {
            return;
        }

        $this->heartbeats->endIdle($session, 'stopped with no process running');
    }
}

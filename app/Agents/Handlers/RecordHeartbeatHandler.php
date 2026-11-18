<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Support\DatabaseClock;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Models\AgentSession;
use App\Contracts\CommandHandler;

/**
 * Takes only the session's row lock, never a stack lock, checks the session may still act and records the beat.
 */
final readonly class RecordHeartbeatHandler implements CommandHandler
{
    public function __construct(private DatabaseClock $clock) {}

    public function handle(RecordHeartbeat $command): void
    {
        $session = AgentSession::lockedForHeartbeat($command->sessionId);
        $session->requireUsable();

        $session->recordHeartbeatAt($this->clock->now());
    }
}

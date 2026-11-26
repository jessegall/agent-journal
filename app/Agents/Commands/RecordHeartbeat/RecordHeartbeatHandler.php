<?php

declare(strict_types=1);

namespace App\Agents\Commands\RecordHeartbeat;

use App\Agents\Concerns\RefusesUnusableSessions;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentSession;
use App\Time\Contracts\ServerClock;

/**
 * Takes only the session's row lock, never a stack lock, checks the session may still act and records the beat.
 */
final readonly class RecordHeartbeatHandler implements CommandHandler
{
    use RefusesUnusableSessions;

    public function __construct(private ServerClock $clock) {}

    public function handle(RecordHeartbeatCommand $command): void
    {
        $session = AgentSession::findLockedForHeartbeat($command->sessionId);
        $this->assertUsableSession($session);

        $session->recordHeartbeatAt($this->clock->now());
    }
}

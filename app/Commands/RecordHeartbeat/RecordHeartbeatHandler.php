<?php

declare(strict_types=1);

namespace App\Commands\RecordHeartbeat;

use App\Concerns\RefusesUnusableSessions;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Agents\AgentSession;

/**
 * Takes only the session's row lock, never a stack lock, checks the session may still act and records the beat.
 */
final readonly class RecordHeartbeatHandler implements CommandHandler
{
    use RefusesUnusableSessions;

    public function __construct(private ServerClock $clock) {}

    public function handle(RecordHeartbeatCommand $command): void
    {
        $session = AgentSession::lockedForHeartbeat($command->sessionId);
        $this->assertUsableSession($session);

        $session->recordHeartbeatAt($this->clock->now());
    }
}

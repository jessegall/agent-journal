<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\LaunchReadiness;
use App\Agents\Models\AgentSession;
use Carbon\CarbonImmutable;

/**
 * Launch readiness kept on the agent session as the signed time of its latest tool discovery.
 */
final readonly class SessionReadiness implements LaunchReadiness
{
    public function recordDiscovery(string $sessionId, CarbonImmutable $signedAt): void
    {
        AgentSession::recordDiscoveryAt($sessionId, $signedAt);
    }

    public function discoveredSince(string $sessionId, CarbonImmutable $generationStartedAt): bool
    {
        return AgentSession::discoveredAfter($sessionId, $generationStartedAt);
    }
}

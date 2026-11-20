<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\ToolDiscovery;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use Carbon\CarbonImmutable;

/**
 * Tool discovery kept on the agent session as the signed time of its latest tool discovery.
 */
final readonly class SessionToolDiscovery implements ToolDiscovery
{
    public function recordDiscovery(string $sessionId, CarbonImmutable $signedAt): void
    {
        AgentSession::recordDiscoveryAt($sessionId, $signedAt);
    }

    public function discoveredSince(string $sessionId, CarbonImmutable $generationStartedAt): bool
    {
        return AgentSession::discoveredAfter($sessionId, $generationStartedAt);
    }

    public function isDiscoveredInCurrentGeneration(string $sessionId): bool
    {
        return AgentRuntime::generationStartOfSession($sessionId)
            ->map(fn (CarbonImmutable $start) => AgentSession::discoveredInOrAfterSecondOf($sessionId, $start))
            ->getOrElse(true);
    }
}

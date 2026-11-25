<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Drivers\ToolDiscovery as ToolDiscoveryContract;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use Carbon\CarbonImmutable;

/**
 * Tool discovery kept on the agent session as the signed time of its latest tool discovery.
 */
final readonly class ToolDiscovery implements ToolDiscoveryContract
{
    public function recordDiscovery(string $sessionId, CarbonImmutable $signedAt): void
    {
        $this->recordDiscoveryAt($sessionId, $signedAt);
    }

    public function isDiscoveredSince(string $sessionId, CarbonImmutable $generationStartedAt): bool
    {
        return AgentSession::isDiscoveredAfter($sessionId, $generationStartedAt);
    }

    public function isDiscoveredInCurrentGeneration(string $sessionId): bool
    {
        return AgentRuntime::resolveGenerationStartOfSession($sessionId)
            ->map(fn (CarbonImmutable $start) => AgentSession::isDiscoveredInOrAfterSecondOf($sessionId, $start))
            ->getOrElse(true);
    }

    /**
     * Records the started driver's tool discovery at its signed issue time; an older discovery never moves it back.
     */
    private function recordDiscoveryAt(string $sessionId, CarbonImmutable $signedAt): void
    {
        AgentSession::query()->whereKey($sessionId)
            ->undiscoveredSince($signedAt)
            ->update(['discovered_at' => $signedAt]);
    }
}

<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Drivers\ToolDiscovery;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

/**
 * Tool discovery kept on the agent session as the signed time of its latest tool discovery.
 */
final readonly class SessionToolDiscovery implements ToolDiscovery
{
    public function recordDiscovery(string $sessionId, CarbonImmutable $signedAt): void
    {
        $this->recordDiscoveryAt($sessionId, $signedAt);
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

    /**
     * Records the started driver's tool discovery at its signed issue time; an older discovery never moves it back.
     */
    private function recordDiscoveryAt(string $sessionId, CarbonImmutable $signedAt): void
    {
        AgentSession::query()->whereKey($sessionId)
            ->where(fn (Builder $older) => $older->whereNull('discovered_at')->orWhere('discovered_at', '<', $signedAt))
            ->update(['discovered_at' => $signedAt]);
    }
}

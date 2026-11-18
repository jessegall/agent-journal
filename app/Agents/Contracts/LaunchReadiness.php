<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\SessionReadiness;
use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\Bind;

/**
 * Whether a launched program has discovered its journal MCP tools, by the signed time of its authenticated tools/list.
 */
#[Bind(SessionReadiness::class)]
interface LaunchReadiness
{
    public function recordDiscovery(string $sessionId, CarbonImmutable $signedAt): void;

    /**
     * Whether the session discovered its tools after the launch generation started.
     */
    public function discoveredSince(string $sessionId, CarbonImmutable $generationStartedAt): bool;
}

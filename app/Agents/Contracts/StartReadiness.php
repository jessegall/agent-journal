<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use Carbon\CarbonImmutable;

/**
 * Whether a started program has discovered its journal MCP tools, by the signed time of its authenticated tools/list.
 */
interface StartReadiness
{
    public function recordDiscovery(string $sessionId, CarbonImmutable $signedAt): void;

    /**
     * Whether the session discovered its tools after its start generation began.
     */
    public function discoveredSince(string $sessionId, CarbonImmutable $generationStartedAt): bool;
}

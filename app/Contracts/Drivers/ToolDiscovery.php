<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use Carbon\CarbonImmutable;

/**
 * Whether a started driver has discovered its journal MCP tools, by the signed time of its authenticated tools/list.
 */
interface ToolDiscovery
{
    public function recordDiscovery(string $sessionId, CarbonImmutable $signedAt): void;

    /**
     * Whether the session discovered its tools after its start generation began.
     */
    public function discoveredSince(string $sessionId, CarbonImmutable $generationStartedAt): bool;

    /**
     * Whether the session may be given work: its tools were discovered after its runtime's current process generation
     * began. A session the host never started has no generation to wait for.
     */
    public function isDiscoveredInCurrentGeneration(string $sessionId): bool;
}

<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\HostReportRefused;
use App\Models\Agents\AgentRuntime;

/**
 * Finds a runtime for its own host, locked, and refuses one of another host.
 */
final readonly class HostRuntimes
{
    /**
     * Hands a runtime's start token to its own host, once.
     */
    public function lockedFor(string $hostId, string $runtimeId): AgentRuntime
    {
        $runtime = AgentRuntime::query()->whereKey($runtimeId)->lockForUpdate()->first();

        if ($runtime !== null
            && $runtime->host_id === $hostId) {
            return $runtime;
        }

        throw HostReportRefused::notOwned($runtimeId);
    }
}

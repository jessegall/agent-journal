<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Models\AgentRuntime;

/**
 * Finds a runtime for its own host, locked, and refuses one of another host.
 */
final readonly class HostRuntimes
{
    /**
     * Hands a runtime's launch credential to its own host, once.
     */
    public function lockedFor(string $hostId, string $runtimeId): AgentRuntime
    {
        $runtime = AgentRuntime::query()->whereKey($runtimeId)->lockForUpdate()->first();

        return $runtime !== null && $runtime->host_id === $hostId ? $runtime : throw HostReportRefused::notOwned($runtimeId);
    }
}

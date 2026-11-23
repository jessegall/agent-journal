<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Exceptions\GatewayRunStale;
use App\Models\Sharing\ShareInstallation;

/**
 * Refuses a gateway report from a run the installation no longer has.
 */
trait RefusesStaleGatewayRuns
{
    /**
     * @throws GatewayRunStale
     */
    private function assertCurrentGatewayRun(ShareInstallation $installation, string $runId): void
    {
        if (! $installation->isCurrentRun($runId)) {
            throw GatewayRunStale::for($runId);
        }
    }
}

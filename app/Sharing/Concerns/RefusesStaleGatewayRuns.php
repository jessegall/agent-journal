<?php

declare(strict_types=1);

namespace App\Sharing\Concerns;

use App\Models\Sharing\ShareInstallation;
use App\Sharing\Exceptions\GatewayRunStale;

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

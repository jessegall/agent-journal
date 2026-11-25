<?php

declare(strict_types=1);

namespace Domain\Sharing\Concerns;

use Domain\Sharing\Exceptions\GatewayRunStale;
use Domain\Sharing\Models\ShareInstallation;

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

<?php

declare(strict_types=1);

namespace App\Sharing\Actions;

use App\Sharing\Exceptions\GatewayRunStale;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\ShareInstallation;

/**
 * The supervisor run that holds the installation's gateways: a run newer than the holder takes them over, after which
 * every endpoint an older run opened counts as stopped and its unfinished claims are released, since a new run never
 * adopts a process it did not start.
 */
final readonly class GatewayRuns
{
    /**
     * Locks the installation and holds it for the run.
     *
     * @throws GatewayRunStale when a newer run holds the gateways
     */
    public function hold(string $runId): void
    {
        if (! ShareInstallation::lockForAdmission()->holdFor($runId)) {
            return;
        }

        ShareGatewayEndpoint::stopAllButRun($runId);
        ShareGatewayOperation::releaseAllButRun($runId);
    }
}

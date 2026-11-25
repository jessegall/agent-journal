<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use Carbon\CarbonImmutable;
use Domain\Sharing\Enums\GatewayEndpointStatus;
use Domain\Sharing\Exceptions\GatewayRunStale;
use Domain\Sharing\Models\ShareGatewayEndpoint;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Models\ShareInstallation;

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
        if (! ShareInstallation::create()->holdFor($runId)) {
            return;
        }

        $this->stopAllButRun($runId);
        $this->releaseAllButRun($runId);
    }

    /**
     * Counts every endpoint another run opened as stopped: a new run never adopts a process it did not start.
     */
    private function stopAllButRun(string $runId): void
    {
        ShareGatewayEndpoint::query()->notOfRun($runId)->stillRunning()->update(
            ['status' => GatewayEndpointStatus::Closed->value],
        );
    }

    /**
     * Releases every operation another run holds without an outcome, so the run that took the gateways over claims it
     * again at once.
     */
    private function releaseAllButRun(string $runId): void
    {
        ShareGatewayOperation::query()
            ->unfinished()
            ->claimedByOtherThan($runId)
            ->update(['lease_ends_at' => CarbonImmutable::now()]);
    }
}

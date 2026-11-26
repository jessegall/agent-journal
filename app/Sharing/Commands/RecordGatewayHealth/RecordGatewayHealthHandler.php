<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RecordGatewayHealth;

use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareInstallation;
use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Concerns\RefusesStaleGatewayRuns;

/**
 * Renews the run's hold on the gateways and notes a healthy endpoint version it holds; an unhealthy report leaves the
 * last healthy time to age. Shares and their deadlines are left alone.
 */
final readonly class RecordGatewayHealthHandler extends SharingCommandHandler
{
    use RefusesStaleGatewayRuns;

    public function handle(RecordGatewayHealthCommand $command): void
    {
        $installation = ShareInstallation::create();
        $this->assertCurrentGatewayRun($installation, $command->runId);
        $installation->holdFor($command->runId);

        $endpoint = ShareGatewayEndpoint::findLockedHeldBy(
            $command->configurationId,
            $command->endpointVersion,
            $command->runId,
        );

        if ($command->isHealthy) {
            $endpoint->recordHealthy();
        }
    }
}

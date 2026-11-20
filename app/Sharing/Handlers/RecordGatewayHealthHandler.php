<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Contracts\CommandHandler;
use App\Sharing\Commands\RecordGatewayHealth;
use App\Sharing\Handlers\Concerns\RefusesStaleGatewayRuns;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareInstallation;

/**
 * Renews the run's hold on the gateways and notes a healthy endpoint version it holds; an unhealthy report leaves the
 * last healthy time to age. Shares and their deadlines are left alone.
 */
final readonly class RecordGatewayHealthHandler implements CommandHandler
{
    use RefusesStaleGatewayRuns;

    public function handle(RecordGatewayHealth $command): void
    {
        $installation = ShareInstallation::lockForAdmission();
        $this->assertCurrentGatewayRun($installation, $command->runId);
        $installation->holdFor($command->runId);
        $endpoint = ShareGatewayEndpoint::lockHeldBy(
            $command->configurationId,
            $command->endpointVersion,
            $command->runId,
        );

        if ($command->healthy) {
            $endpoint->recordHealthy();
        }
    }
}

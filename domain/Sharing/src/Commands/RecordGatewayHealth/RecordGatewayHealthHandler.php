<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\RecordGatewayHealth;

use Domain\Sharing\Concerns\RefusesStaleGatewayRuns;
use App\Contracts\Bus\CommandHandler;
use Domain\Sharing\Models\ShareGatewayEndpoint;
use Domain\Sharing\Models\ShareInstallation;

/**
 * Renews the run's hold on the gateways and notes a healthy endpoint version it holds; an unhealthy report leaves the
 * last healthy time to age. Shares and their deadlines are left alone.
 */
final readonly class RecordGatewayHealthHandler implements CommandHandler
{
    use RefusesStaleGatewayRuns;

    public function handle(RecordGatewayHealthCommand $command): void
    {
        $installation = ShareInstallation::create();
        $this->assertCurrentGatewayRun($installation, $command->runId);
        $installation->holdFor($command->runId);

        $endpoint = ShareGatewayEndpoint::lockHeldBy(
            $command->configurationId,
            $command->endpointVersion,
            $command->runId,
        );

        if ($command->isHealthy) {
            $endpoint->recordHealthy();
        }
    }
}

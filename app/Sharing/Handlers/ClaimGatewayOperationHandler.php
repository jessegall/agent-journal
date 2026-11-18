<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Contracts\CommandHandler;
use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Enums\GatewayEndpointState;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Support\ClaimedGatewayOperation;

/**
 * Locks the installation and holds it for the run (a newer run takes over and every endpoint of older runs counts as
 * stopped and their unfinished operations are released), then the operation's configuration, the run's running endpoint and the operation, in that order. An open
 * reuses the run's running endpoint or starts the next version, never a closing one; a close moves the run's endpoint
 * to closing, and with none running it is done at once. No I/O happens here.
 */
final readonly class ClaimGatewayOperationHandler implements CommandHandler
{
    public function handle(ClaimGatewayOperation $command): ClaimedGatewayOperation|null
    {
        if (ShareInstallation::lockForAdmission()->holdFor($command->runId)) {
            ShareGatewayEndpoint::stopAllButRun($command->runId);
            ShareGatewayOperation::releaseAllButRun($command->runId);
        }

        $operationId = $command->operationId ?? ShareGatewayOperation::nextClaimable()->getOrElse(null);

        if ($operationId === null) {
            return null;
        }

        $configuration = ShareGatewayConfiguration::lockById(ShareGatewayOperation::of($operationId)->share_gateway_configuration_id);
        $running = ShareGatewayEndpoint::lockRunningOf($configuration, $command->runId);
        $operation = ShareGatewayOperation::lockById($operationId);

        if (! $operation->isClaimable()) {
            return null;
        }

        if ($operation->type === GatewayOperationType::Close && $running->isEmpty()) {
            $operation->finish(GatewayOutcome::Succeeded);

            return null;
        }

        $endpoint = $running->getOrCall(fn () => ShareGatewayEndpoint::openNextFor($configuration, $command->runId));

        if ($operation->type === GatewayOperationType::Close) {
            $endpoint->moveTo(GatewayEndpointState::Closing);
        }

        return new ClaimedGatewayOperation($operation->type, $operation->claimFor($command->runId, $endpoint, $configuration->toConfiguration()));
    }
}

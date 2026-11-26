<?php

declare(strict_types=1);

namespace App\Sharing\Commands\ClaimGatewayOperation;

use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareGatewayOperation;
use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Enums\GatewayEndpointStatus;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Support\ClaimedGatewayOperation;
use App\Sharing\Support\GatewayRuns;

/**
 * Claims a gateway operation for the run, which takes the installation over from older runs. An open reuses the run's
 * running endpoint or starts the next version; a close moves the endpoint to closing, or is done at once with none
 * running.
 */
final readonly class ClaimGatewayOperationHandler extends SharingCommandHandler
{
    public function __construct(private GatewayRuns $runs) {}

    public function handle(ClaimGatewayOperationCommand $command): ClaimedGatewayOperation|null
    {
        $this->runs->hold($command->runId);

        $operationId = $command->operationId ?? ShareGatewayOperation::resolveNextClaimable()->getOrElse(null);

        if ($operationId === null) {
            return null;
        }

        $configuration = ShareGatewayConfiguration::findLockedById(
            ShareGatewayOperation::findOf($operationId)->share_gateway_configuration_id,
        );

        $running = ShareGatewayEndpoint::findLockedRunningOf($configuration, $command->runId);
        $operation = ShareGatewayOperation::findLockedById($operationId);

        if (! $operation->isClaimable()) {
            return null;
        }

        if ($operation->type === GatewayOperationType::Close && $running->isEmpty()) {
            $operation->finish(GatewayOutcome::Succeeded);

            return null;
        }

        $endpoint = $running->getOrCall(
            fn () => ShareGatewayEndpoint::createForConfiguration($configuration, $command->runId),
        );

        if ($operation->type === GatewayOperationType::Close) {
            $endpoint->moveTo(GatewayEndpointStatus::Closing);
        }

        return new ClaimedGatewayOperation(
            $operation->type,
            $operation->claimFor($command->runId, $endpoint, $configuration->toConfiguration),
        );
    }
}

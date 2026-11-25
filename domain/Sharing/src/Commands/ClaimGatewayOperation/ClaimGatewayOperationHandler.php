<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\ClaimGatewayOperation;

use Domain\Sharing\Commands\Support\SharingCommandHandler;
use Domain\Sharing\Enums\GatewayEndpointState;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\GatewayOutcome;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayEndpoint;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Support\ClaimedGatewayOperation;
use Domain\Sharing\Support\GatewayRuns;

/**
 * Locks the installation and holds it for the run (a newer run takes over and every endpoint of older runs counts as
 * stopped and their unfinished operations are released), then the operation's configuration, the run's running endpoint
 * and the operation, in that order. An open
 * reuses the run's running endpoint or starts the next version, never a closing one; a close moves the run's endpoint
 * to closing, and with none running it is done at once. No I/O happens here.
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

        $endpoint = $running->getOrCall(fn () => ShareGatewayEndpoint::createForConfiguration($configuration, $command->runId));

        if ($operation->type === GatewayOperationType::Close) {
            $endpoint->moveTo(GatewayEndpointState::Closing);
        }

        return new ClaimedGatewayOperation(
            $operation->type,
            $operation->claimFor($command->runId, $endpoint, $configuration->toConfiguration),
        );
    }
}

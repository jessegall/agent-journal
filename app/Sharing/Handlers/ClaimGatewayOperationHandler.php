<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Contracts\CommandHandler;
use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Enums\GatewayEndpointState;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Support\ClaimedGatewayOperation;
use App\Sharing\Support\GatewayOperation;

/**
 * Locks the installation and holds it for the run (a newer run takes over and every endpoint of older runs counts as
 * stopped), then the operation's configuration, its endpoint and the operation, in that order. An open reuses the
 * run's running endpoint or starts the next version; a close moves the run's endpoint to closing. No I/O happens here.
 */
final readonly class ClaimGatewayOperationHandler implements CommandHandler
{
    public function handle(ClaimGatewayOperation $command): ClaimedGatewayOperation|null
    {
        $installation = ShareInstallation::lockForAdmission();

        if ($installation->holdFor($command->runId)) {
            ShareGatewayEndpoint::stopAllButRun($command->runId);
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

        $endpoint = $operation->type === GatewayOperationType::Open
            ? $running->getOrCall(fn () => ShareGatewayEndpoint::openNextFor($configuration, $command->runId))
            : $running->getOrCall(fn () => ShareGatewayEndpoint::openNextFor($configuration, $command->runId));

        if ($operation->type === GatewayOperationType::Close) {
            $endpoint->moveTo(GatewayEndpointState::Closing);
        }

        $operation->claimFor($command->runId, $endpoint);

        return new ClaimedGatewayOperation($operation->type, new GatewayOperation(
            $operation->id,
            $command->runId,
            $endpoint->endpoint_version,
            (string) $operation->lease_token,
            $operation->lease_ends_at?->getTimestamp() ?? 0,
            $configuration->toConfiguration(),
        ));
    }
}

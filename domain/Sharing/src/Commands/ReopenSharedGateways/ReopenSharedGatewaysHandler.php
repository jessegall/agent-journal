<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\ReopenSharedGateways;

use Domain\Sharing\Commands\Support\SharingCommandHandler;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Support\GatewayRuns;

/**
 * Holds the gateways for the new run, then, under each configuration's lock, requests an open of every configuration
 * that serves a live, unexpired share and has no open waiting already.
 */
final readonly class ReopenSharedGatewaysHandler extends SharingCommandHandler
{
    public function __construct(private GatewayRuns $runs) {}

    public function handle(ReopenSharedGatewaysCommand $command): int
    {
        $this->runs->hold($command->runId);
        $configurations = ShareGatewayConfiguration::lockAllById(Share::reopenableConfigurations());

        $waiting = ShareGatewayOperation::configurationsWaitingToOpen(array_map(
            fn (ShareGatewayConfiguration $configuration) => $configuration->id,
            $configurations,
        ));

        $reopenable = [];

        foreach ($configurations as $configuration) {
            if ($configuration->isDisabled() || in_array($configuration->id, $waiting, true)) {
                continue;
            }

            $reopenable[] = $configuration;
        }

        ShareGatewayOperation::createManyForConfigurations($reopenable, GatewayOperationType::Open);

        return count($reopenable);
    }
}

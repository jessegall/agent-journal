<?php

declare(strict_types=1);

namespace App\Sharing\Commands\ReopenSharedGateways;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;
use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Support\GatewayRuns;

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
        $configurations = ShareGatewayConfiguration::findLockedAllById(Share::resolveReopenableConfigurations());

        $waiting = ShareGatewayOperation::resolveConfigurationsWaitingToOpen(array_map(
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

<?php

declare(strict_types=1);

namespace App\Commands\Sharing\ReopenSharedGateways;

use App\Contracts\Bus\CommandHandler;
use App\Enums\GatewayOperationType;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;
use App\Support\GatewayRuns;

/**
 * Holds the gateways for the new run, then, under each configuration's lock, requests an open of every configuration
 * that serves a live, unexpired share and has no open waiting already.
 */
final readonly class ReopenSharedGatewaysHandler implements CommandHandler
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

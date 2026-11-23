<?php

declare(strict_types=1);

namespace App\Commands\ReopenSharedGateways;

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
        $configurations = ShareGatewayConfiguration::lockAllById(Share::configurationsToReopen());

        $waiting = ShareGatewayOperation::configurationsWaitingToOpen(array_map(
            fn (ShareGatewayConfiguration $configuration) => $configuration->id,
            $configurations,
        ));

        $opens = [];

        foreach ($configurations as $configuration) {
            if ($configuration->isDisabled() || in_array($configuration->id, $waiting, true)) {
                continue;
            }

            $opens[] = ShareGatewayOperation::unsaved($configuration, GatewayOperationType::Open);
        }

        ShareGatewayOperation::createAll($opens);

        return count($opens);
    }
}

<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Contracts\CommandHandler;
use App\Sharing\Actions\GatewayRuns;
use App\Sharing\Commands\ReopenSharedGateways;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;

/**
 * Holds the gateways for the new run, then, under each configuration's lock, requests an open of every configuration
 * that serves a live, unexpired share and has no open waiting already.
 */
final readonly class ReopenSharedGatewaysHandler implements CommandHandler
{
    public function __construct(private GatewayRuns $runs) {}

    public function handle(ReopenSharedGateways $command): int
    {
        $this->runs->hold($command->runId);
        $requested = 0;

        foreach (Share::configurationsToReopen() as $configurationId) {
            $configuration = ShareGatewayConfiguration::lockById($configurationId);

            if ($configuration->isDisabled() || ShareGatewayOperation::hasUnfinishedOpenFor($configuration)) {
                continue;
            }

            ShareGatewayOperation::request($configuration, GatewayOperationType::Open);
            $requested++;
        }

        return $requested;
    }
}

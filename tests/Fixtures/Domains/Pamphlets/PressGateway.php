<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Pamphlets;

use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\GatewayEndpoint;
use App\Sharing\Support\GatewayHealth;
use App\Sharing\Support\GatewayOperation;
use App\Sharing\Support\GatewayReadiness;

/**
 * A gateway that is always ready and healthy and opens an endpoint on its configured origin.
 */
final class PressGateway implements ShareGateway
{
    public function readiness(GatewayConfiguration $configuration): GatewayReadiness
    {
        return GatewayReadiness::ready();
    }

    public function open(GatewayOperation $operation): GatewayEndpoint
    {
        return new GatewayEndpoint($operation->runId, $operation->endpointVersion, $operation->settings()->publicOrigin, 'press');
    }

    public function health(GatewayEndpoint $endpoint): GatewayHealth
    {
        return GatewayHealth::healthy();
    }

    public function close(GatewayEndpoint $endpoint): void {}
}

<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Pamphlets;

use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Support\Gateways\GatewayConfiguration;
use App\Sharing\Support\Gateways\GatewayEndpoint;
use App\Sharing\Support\Gateways\GatewayHealth;
use App\Sharing\Support\Gateways\GatewayOperation;
use App\Sharing\Support\Gateways\GatewaySetupCheck;

/**
 * A gateway that is always ready and healthy and opens an endpoint on its configured origin.
 */
final class PressGateway implements ShareGateway
{
    public function setupCheck(GatewayConfiguration $configuration): GatewaySetupCheck
    {
        return GatewaySetupCheck::passed();
    }

    public function open(GatewayOperation $operation): GatewayEndpoint
    {
        return new GatewayEndpoint(
            $operation->runId,
            $operation->endpointVersion,
            $operation->settings()->publicOrigin,
            'press',
        );
    }

    public function health(GatewayEndpoint $endpoint): GatewayHealth
    {
        return GatewayHealth::healthy();
    }

    public function close(GatewayEndpoint $endpoint): void {}
}

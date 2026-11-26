<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Support;

use Domain\Sharing\Contracts\ShareGateway;
use Domain\Sharing\Support\Gateways\GatewayConfiguration;
use Domain\Sharing\Support\Gateways\GatewayEndpoint;
use Domain\Sharing\Support\Gateways\GatewayHealth;
use Domain\Sharing\Support\Gateways\GatewayOperation;
use Domain\Sharing\Support\Gateways\GatewaySetupCheck;

/**
 * A gateway that is never ready, for the rule that only a ready gateway becomes the default.
 */
final class UnconfiguredShareGateway implements ShareGateway
{
    public const string KEY = 'unconfigured';

    public function setupCheck(GatewayConfiguration $configuration): GatewaySetupCheck
    {
        return new GatewaySetupCheck(['The journal is not logged in to this provider.']);
    }

    public function open(GatewayOperation $operation): GatewayEndpoint
    {
        return new GatewayEndpoint(
            $operation->runId,
            $operation->endpointVersion,
            $operation->settings()->publicOrigin,
            self::KEY,
        );
    }

    public function health(GatewayEndpoint $endpoint): GatewayHealth
    {
        return GatewayHealth::healthy();
    }

    public function close(GatewayEndpoint $endpoint): void {}
}

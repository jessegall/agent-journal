<?php

declare(strict_types=1);

namespace App\Sharing\Contracts;

use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\GatewayEndpoint;
use App\Sharing\Support\GatewayHealth;
use App\Sharing\Support\GatewayOperation;
use App\Sharing\Support\GatewayReadiness;

/**
 * A tunnel program that makes the sharing listener reachable on a fixed public origin, registered under a key such
 * as tunler. The supervisor calls it outside every bus command and database transaction.
 */
interface ShareGateway
{
    public function readiness(GatewayConfiguration $configuration): GatewayReadiness;

    public function open(GatewayOperation $operation): GatewayEndpoint;

    public function health(GatewayEndpoint $endpoint): GatewayHealth;

    public function close(GatewayEndpoint $endpoint): void;
}

<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\GatewayConfiguration;
use App\Support\GatewayEndpoint;
use App\Support\GatewayHealth;
use App\Support\GatewayOperation;
use App\Support\GatewaySetupCheck;

/**
 * A tunnel program that makes the sharing listener reachable on a fixed public origin, registered under a key such
 * as tunler. The supervisor calls it outside every bus command and database transaction.
 */
interface ShareGateway
{
    public function setupCheck(GatewayConfiguration $configuration): GatewaySetupCheck;

    public function open(GatewayOperation $operation): GatewayEndpoint;

    public function health(GatewayEndpoint $endpoint): GatewayHealth;

    public function close(GatewayEndpoint $endpoint): void;
}

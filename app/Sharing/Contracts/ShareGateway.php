<?php

declare(strict_types=1);

namespace App\Sharing\Contracts;

use App\Sharing\Support\Gateways\GatewayConfiguration;
use App\Sharing\Support\Gateways\GatewayEndpoint;
use App\Sharing\Support\Gateways\GatewayHealth;
use App\Sharing\Support\Gateways\GatewayOperation;
use App\Sharing\Support\Gateways\GatewaySetupCheck;

/**
 * A tunnel program that makes the sharing listener reachable on a fixed public origin, registered under a key such
 * as tunler. The supervisor calls it outside every bus command and database transaction.
 */
interface ShareGateway
{
    /**
     * Whether the gateway is set up well enough to open endpoints, and what is missing when it is not.
     */
    public function setupCheck(GatewayConfiguration $configuration): GatewaySetupCheck;

    /**
     * Brings up an endpoint for the operation, and gives its address.
     */
    public function open(GatewayOperation $operation): GatewayEndpoint;

    /**
     * Whether the endpoint is up and answering.
     */
    public function health(GatewayEndpoint $endpoint): GatewayHealth;

    /**
     * Takes the endpoint down, so nothing is shared through it any more.
     */
    public function close(GatewayEndpoint $endpoint): void;
}

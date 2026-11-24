<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sharing\ShareGatewayEvent;
use App\Enums\GatewayEndpointState;

/**
 * A share gateway endpoint moved to the state given.
 */
final readonly class ShareGatewayEndpointMoved extends ShareEvent implements ShareGatewayEvent
{
    public function __construct(
        public string $endpointId,
        public GatewayEndpointState $state,
    ) {}
}

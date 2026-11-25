<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use Domain\Sharing\Contracts\ShareGatewayEvent;
use Domain\Sharing\Enums\GatewayEndpointState;

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

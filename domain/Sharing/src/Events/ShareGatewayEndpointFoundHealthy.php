<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use Domain\Sharing\Contracts\ShareGatewayEvent;

/**
 * A share gateway endpoint was found healthy.
 */
final readonly class ShareGatewayEndpointFoundHealthy extends ShareEvent implements ShareGatewayEvent
{
    public function __construct(
        public string $endpointId,
    ) {}
}

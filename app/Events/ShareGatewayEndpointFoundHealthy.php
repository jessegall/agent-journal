<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sharing\ShareGatewayEvent;

/**
 * A share gateway endpoint was found healthy.
 */
final readonly class ShareGatewayEndpointFoundHealthy extends ShareEvent implements ShareGatewayEvent
{
    public function __construct(
        public string $endpointId,
    ) {}
}

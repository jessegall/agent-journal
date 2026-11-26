<?php

declare(strict_types=1);

namespace App\Events\Sharing;

use App\Sharing\Contracts\ShareGatewayEvent;

/**
 * A share gateway endpoint was found healthy.
 */
final readonly class ShareGatewayEndpointFoundHealthy implements ShareEvent, ShareGatewayEvent
{
    public function __construct(
        public string $endpointId,
    ) {}
}

<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use Domain\Sharing\Contracts\ShareGatewayEvent;

/**
 * A share gateway operation was claimed by a run on an endpoint.
 */
final readonly class ShareGatewayOperationClaimed implements ShareEvent, ShareGatewayEvent
{
    public function __construct(
        public string $operationId,
        public string $runId,
    ) {}
}

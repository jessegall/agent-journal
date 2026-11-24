<?php

declare(strict_types=1);

namespace App\Events\Sharing;

use App\Contracts\Sharing\ShareGatewayEvent;

/**
 * A share gateway operation was claimed by a run on an endpoint.
 */
final readonly class ShareGatewayOperationClaimed extends ShareEvent implements ShareGatewayEvent
{
    public function __construct(
        public string $operationId,
        public string $runId,
    ) {}
}

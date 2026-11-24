<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sharing\ShareGatewayEvent;
use App\Enums\GatewayOutcome;

/**
 * A share gateway operation finished with the outcome given.
 */
final readonly class ShareGatewayOperationFinished extends ShareEvent implements ShareGatewayEvent
{
    public function __construct(
        public string $operationId,
        public GatewayOutcome $outcome,
    ) {}
}

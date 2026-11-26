<?php

declare(strict_types=1);

namespace App\Events\Sharing;

use App\Sharing\Contracts\ShareGatewayEvent;
use App\Sharing\Enums\GatewayOutcome;

/**
 * A share gateway operation finished with the outcome given.
 */
final readonly class ShareGatewayOperationFinished implements ShareEvent, ShareGatewayEvent
{
    public function __construct(
        public string $operationId,
        public GatewayOutcome $outcome,
    ) {}
}

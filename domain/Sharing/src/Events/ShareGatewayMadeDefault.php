<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use Domain\Sharing\Contracts\ShareGatewayEvent;

/**
 * A gateway configuration became the one new shares open through.
 */
final readonly class ShareGatewayMadeDefault implements ShareEvent, ShareGatewayEvent
{
    public function __construct(public string $configurationId) {}
}

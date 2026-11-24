<?php

declare(strict_types=1);

namespace App\Events\Sharing;

use App\Contracts\Sharing\ShareGatewayEvent;

/**
 * A gateway configuration became the one new shares open through.
 */
final readonly class ShareGatewayMadeDefault extends ShareEvent implements ShareGatewayEvent
{
    public function __construct(public string $configurationId) {}
}

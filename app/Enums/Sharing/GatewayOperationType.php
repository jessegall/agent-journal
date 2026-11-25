<?php

declare(strict_types=1);

namespace App\Enums\Sharing;

/**
 * What a gateway operation asks the supervisor to do with an endpoint: open it or close it.
 */
enum GatewayOperationType: string
{
    case Open = 'open';
    case Close = 'close';
}

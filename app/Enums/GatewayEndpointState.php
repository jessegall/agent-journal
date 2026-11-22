<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where one endpoint version of a gateway stands: being opened, serving, being closed or closed for good.
 */
enum GatewayEndpointState: string
{
    case Opening = 'opening';
    case Open = 'open';
    case Closing = 'closing';
    case Closed = 'closed';
}

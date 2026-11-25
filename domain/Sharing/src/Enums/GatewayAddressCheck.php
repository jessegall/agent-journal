<?php

declare(strict_types=1);

namespace Domain\Sharing\Enums;

/**
 * What a gateway sees of its starting program's address on one look: its own configured address, another address,
 * or nothing yet.
 */
enum GatewayAddressCheck
{
    case Confirmed;
    case Unexpected;
    case Waiting;
}

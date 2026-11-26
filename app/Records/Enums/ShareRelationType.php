<?php

declare(strict_types=1);

namespace App\Records\Enums;

/**
 * How a shared record reaches another: an owned child its own provider reads, or a linked record the owner approved.
 */
enum ShareRelationType: string
{
    case Owned = 'owned';
    case Linked = 'linked';
}

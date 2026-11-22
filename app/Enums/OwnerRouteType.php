<?php

declare(strict_types=1);

namespace App\Enums;

enum OwnerRouteType: string
{
    case ChainEnd = 'chain_end';
    case NoOwner = 'no_owner';
}

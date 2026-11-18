<?php

declare(strict_types=1);

namespace App\Assignments\Enums;

/**
 * Whether a pool holds every record of its type or only the records it lists, in their listed order.
 */
enum PoolMembersType: string
{
    case All = 'all';
    case Ordered = 'ordered';
}

<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where one piece of a chat body stands for its receiving agent: still to be confirmed, confirmed, or given up.
 */
enum OutstandingRangeState: string
{
    case Outstanding = 'outstanding';
    case Confirmed = 'confirmed';
    case Exhausted = 'exhausted';
}

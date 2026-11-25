<?php

declare(strict_types=1);

namespace App\Enums\Reviews;

/**
 * What a reviewer decided about certified work: approved for its merge, or returned for repair.
 */
enum ReviewDecisionType: string
{
    case Approved = 'approved';
    case Returned = 'returned';
}

<?php

declare(strict_types=1);

namespace App\Numbers\Exceptions;

use App\Numbers\Models\NumberGroup;
use RuntimeException;

/**
 * A number group handed out its last number.
 */
final class NumberLimitReached extends RuntimeException
{
    public static function for(NumberGroup $group): self
    {
        return new self(
            "The number group for {$group->record_type} of {$group->holder_type} {$group->holder_id} has handed out its last number.",
        );
    }
}

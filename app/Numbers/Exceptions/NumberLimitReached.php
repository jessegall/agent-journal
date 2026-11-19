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
            sprintf(
                'The number group for %s of %s %s has handed out its last number.',
                $group->record_type,
                $group->holder_type,
                $group->holder_id,
            ),
        );
    }
}

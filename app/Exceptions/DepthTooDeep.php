<?php

declare(strict_types=1);

namespace App\Exceptions;

use InvalidArgumentException;

/**
 * A list or walk asked to descend no level, or more levels than any call may ask for.
 */
final class DepthTooDeep extends InvalidArgumentException
{
    public static function asked(int $levels, int $limit): self
    {
        return new self("A list or walk descends 1 to {$limit} levels; {$levels} was asked.");
    }
}

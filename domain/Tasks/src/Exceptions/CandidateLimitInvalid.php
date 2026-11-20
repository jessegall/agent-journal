<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use InvalidArgumentException;

/**
 * A pick of open tasks asked for fewer than one or more than the largest list of record ids.
 */
final class CandidateLimitInvalid extends InvalidArgumentException
{
    public static function for(int $limit, int $maximumTaskCount): self
    {
        return new self("A pick of open tasks takes 1 to {$maximumTaskCount} tasks; {$limit} is not allowed.");
    }
}

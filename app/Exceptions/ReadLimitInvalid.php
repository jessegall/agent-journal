<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A configured page size that is not a positive number within the largest page.
 */
final class ReadLimitInvalid extends RuntimeException
{
    public static function configured(int $limit, int $pageMax): self
    {
        return new self("The reads.default_limit {$limit} must be between 1 and reads.page_max {$pageMax}.");
    }
}

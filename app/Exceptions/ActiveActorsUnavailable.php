<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * The present actors could not be counted; a reader keeps its last safe value instead of reading zero.
 */
final class ActiveActorsUnavailable extends RuntimeException
{
    public static function because(Throwable $cause): self
    {
        return new self("The present actors could not be counted: {$cause->getMessage()}", previous: $cause);
    }
}

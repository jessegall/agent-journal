<?php

declare(strict_types=1);

namespace Tests\Support\Recordings\Exceptions;

use RuntimeException;

/**
 * A call was made that the recording holds no unplayed call of its method and path shape for.
 */
final class UnrecordedCall extends RuntimeException
{
    public static function asked(string $asked, string $next): self
    {
        return new self("{$asked} was asked where the recording holds {$next} next.");
    }

    public static function afterEveryCall(string $asked): self
    {
        return new self("{$asked} was asked after every recorded call was played.");
    }
}

<?php

declare(strict_types=1);

namespace App\Operations\Exceptions;

use App\Operations\Enums\ResourceAreaType;
use InvalidArgumentException;

/**
 * A resource area name no policy knows.
 */
final class UnknownResourceArea extends InvalidArgumentException
{
    public static function forKey(string $key): self
    {
        return new self(
            sprintf(
                '%s is not a resource area. Use one of %s.',
                $key,
                implode(', ', array_column(ResourceAreaType::cases(), 'value')),
            ),
        );
    }
}

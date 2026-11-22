<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use InvalidArgumentException;

/**
 * A title, abstract or body over its limit.
 */
final class ContentTooLarge extends InvalidArgumentException implements CommandRefusal
{
    public static function field(string $field, string $limit): self
    {
        return new self("The {$field} is longer than {$limit}; shorten it.");
    }
}

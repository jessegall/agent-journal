<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A title, abstract or body that is empty.
 */
final class ContentMissing extends InvalidArgumentException implements CommandRefusal
{
    public static function field(string $field): self
    {
        return new self("The {$field} is empty; write it before saving.");
    }
}

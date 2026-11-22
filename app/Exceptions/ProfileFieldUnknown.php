<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A field of a profile's start policy that its provenance does not record.
 */
final class ProfileFieldUnknown extends LogicException
{
    public static function named(string $field): self
    {
        return new self("A profile's start policy records no field {$field}.");
    }
}

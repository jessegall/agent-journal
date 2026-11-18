<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use LogicException;

/**
 * A field of a profile's launch policy that its provenance does not record.
 */
final class ProfileFieldUnknown extends LogicException
{
    public static function named(string $field): self
    {
        return new self("A profile's launch policy records no field {$field}.");
    }
}

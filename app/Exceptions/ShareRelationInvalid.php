<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A shareable record type declares a relation twice, or one that needs a capability no registered record advertises.
 */
final class ShareRelationInvalid extends LogicException
{
    public static function repeated(string $alias, string $relation): self
    {
        return new self("{$alias} declares the share relation {$relation} twice.");
    }

    public static function unknownCapability(string $alias, string $relation, string $capability): self
    {
        return new self(
            "The share relation {$relation} of {$alias} needs {$capability}, which no registered record advertises.",
        );
    }
}

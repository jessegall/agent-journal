<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use LogicException;

/**
 * A shareable record type declares a relation twice.
 */
final class ShareRelationInvalid extends LogicException
{
    public static function repeated(string $alias, string $relation): self
    {
        return new self("{$alias} declares the share relation {$relation} twice.");
    }
}

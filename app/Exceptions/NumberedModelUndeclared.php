<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A record was to be numbered though its link type names no model that implements Numbered.
 */
final class NumberedModelUndeclared extends LogicException
{
    public static function for(string $linkType): self
    {
        return new self("No model with the link type {$linkType} implements Numbered, so its records cannot be numbered.");
    }
}

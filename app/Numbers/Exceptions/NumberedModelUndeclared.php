<?php

declare(strict_types=1);

namespace App\Numbers\Exceptions;

use LogicException;

/**
 * A record was to be numbered though no owner declared its model as numbered.
 */
final class NumberedModelUndeclared extends LogicException
{
    public static function for(string $linkType): self
    {
        return new self("No owner declares {$linkType} as numbered; list its model in the owner's numberedModels().");
    }
}

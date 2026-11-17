<?php

declare(strict_types=1);

namespace App\Core\Links\Exceptions;

use LogicException;

/**
 * A link name or a linkable model was registered twice with different partners.
 */
final class LinkTypeRepeated extends LogicException
{
    public static function for(string $name, string $model): self
    {
        return new self("The link name {$name} or the model {$model} is already registered with another partner.");
    }
}

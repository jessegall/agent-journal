<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A link names a type no model is registered under.
 */
final class UnknownLinkType extends RuntimeException
{
    public static function forAlias(string $alias): self
    {
        return new self("No model is registered under the link name {$alias}.");
    }
}

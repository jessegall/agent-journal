<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A reflection was asked for a class, interface, trait or enum that no autoloader can load.
 */
final class ClassMissing extends RuntimeException
{
    public static function for(string $name): self
    {
        return new self("No class, interface, trait or enum named {$name} can be loaded.");
    }
}

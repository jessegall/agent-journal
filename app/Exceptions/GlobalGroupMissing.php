<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * The installation has no global number group of this name, because numbers:install has not run.
 */
final class GlobalGroupMissing extends RuntimeException
{
    public static function named(string $name): self
    {
        return new self("The global number group {$name} is missing; run php artisan numbers:install.");
    }
}

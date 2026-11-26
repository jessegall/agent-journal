<?php

declare(strict_types=1);

namespace App\Records\Exceptions;

use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * The installation has no global number group of this name, because numbers:install has not run.
 */
final class GlobalGroupMissing extends RuntimeException
{
    /**
     * @use ThrowsLater<GlobalGroupMissing>
     */
    use ThrowsLater;

    public static function named(string $name): self
    {
        return new self("The global number group {$name} is missing; run php artisan numbers:install.");
    }
}

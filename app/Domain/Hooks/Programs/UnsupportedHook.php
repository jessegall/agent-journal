<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use LogicException;

/**
 * A hook the program's adapter does not map; it is refused by name, never allowed by default.
 */
final class UnsupportedHook extends LogicException
{
    public static function for(string $program, string $hookMethod): self
    {
        return new self("The {$program} adapter does not map {$hookMethod}.");
    }
}

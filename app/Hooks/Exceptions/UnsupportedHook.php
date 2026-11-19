<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

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

    public static function forTool(string $program, string $toolName): self
    {
        return new self(
            sprintf(
                'The %s adapter does not know the tool %s, so the call is refused rather than let through.',
                $program,
                $toolName,
            ),
        );
    }

    public static function forResource(string $program, string $toolName): self
    {
        return new self(
            "The {$program} call {$toolName} names a server or address other than the journal's, so it is refused.",
        );
    }

    public static function forValue(string $program, string $field, string $value): self
    {
        return new self("The {$program} adapter cannot read the {$field} value {$value}.");
    }
}

<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Exceptions\Concerns\ThrowsLater;
use LogicException;

/**
 * A hook the driver's adapter does not map; it is refused by name, never allowed by default.
 */
final class UnsupportedHook extends LogicException
{
    /** @use ThrowsLater<UnsupportedHook> */
    use ThrowsLater;

    public static function for(string $driver, string $method): self
    {
        return new self("The {$driver} adapter does not map {$method}.");
    }

    public static function forTool(string $driver, string $toolName): self
    {
        return new self(
            sprintf(
                'The %s adapter does not know the tool %s, so the call is refused rather than let through.',
                $driver,
                $toolName,
            ),
        );
    }

    public static function notAnOperation(string $driver, string $toolName): self
    {
        return new self(sprintf(
            'The %s tool %s declares no operation: it is judged as a shell line or file edit, or touches nothing.',
            $driver,
            $toolName,
        ));
    }

    public static function forResource(string $driver, string $toolName): self
    {
        return new self(
            "The {$driver} call {$toolName} names a server or address other than the journal's, so it is refused.",
        );
    }

    public static function forValue(string $driver, string $field, string $hookField): self
    {
        return new self("The {$driver} adapter cannot read the {$field} value {$hookField}.");
    }
}

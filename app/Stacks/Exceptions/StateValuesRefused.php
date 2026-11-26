<?php

declare(strict_types=1);

namespace App\Stacks\Exceptions;

use Throwable;
use UnexpectedValueException;

/**
 * A state could not be built from its values: one is missing or is not of the type the state declares.
 */
final class StateValuesRefused extends UnexpectedValueException
{
    public static function missing(string $typeKey, int $version, string $name): self
    {
        return new self("State {$typeKey} version {$version} needs the value {$name}, which its frame does not hold.");
    }

    public static function mistyped(string $typeKey, int $version, string $name, Throwable $reason): self
    {
        return new self(
            "State {$typeKey} version {$version} cannot take its value {$name}: {$reason->getMessage()}",
            previous: $reason,
        );
    }
}

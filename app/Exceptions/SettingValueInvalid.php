<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\Settings\SettingType;
use RuntimeException;
use Throwable;

/**
 * A value a setting does not accept, refused before it is stored; the message names the setting and the type it
 * expects, never the value.
 */
final class SettingValueInvalid extends RuntimeException
{
    public static function for(string $owner, string $key, SettingType $expected, Throwable|null $previous = null): self
    {
        return new self(
            "The value for the setting {$key} of {$owner} is not a {$expected->value} value it accepts.",
            previous: $previous,
        );
    }

    public static function notToggleGroup(string $owner, string $key): self
    {
        return new self("The settings group {$key} of {$owner} cannot be switched on or off.");
    }
}

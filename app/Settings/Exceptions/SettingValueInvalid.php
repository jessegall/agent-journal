<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use App\Settings\Enums\SettingType;
use RuntimeException;

/**
 * A value a setting does not accept, refused before it is stored; the message names the setting and the type it
 * expects, never the value.
 */
final class SettingValueInvalid extends RuntimeException
{
    public static function for(string $owner, string $key, SettingType $expected): self
    {
        return new self("The value for the setting {$key} of {$owner} is not a {$expected->value} value it accepts.");
    }

    public static function notToggleGroup(string $owner, string $key): self
    {
        return new self("The settings group {$key} of {$owner} cannot be switched on or off.");
    }
}

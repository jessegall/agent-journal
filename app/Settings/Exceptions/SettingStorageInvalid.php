<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use RuntimeException;

/**
 * A stored override its declared setting does not accept; resetting that one setting repairs it. The message names
 * the setting only.
 */
final class SettingStorageInvalid extends RuntimeException
{
    public static function for(string $owner, string $key): self
    {
        return new self(
            "The stored value of the setting {$key} of {$owner} is not one it accepts; reset it to repair it.",
        );
    }
}

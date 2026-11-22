<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A setting or group that is not available where it was asked for: not registered under that owner and key, or not
 * part of the group or snapshot it was asked of.
 */
final class SettingUnavailable extends LogicException
{
    public static function for(string $owner, string $key): self
    {
        return new self("The setting {$key} of {$owner} is not available here.");
    }
}

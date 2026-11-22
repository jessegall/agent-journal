<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * An actor the settings access policy does not allow asked to read or change settings.
 */
final class SettingsAccessDenied extends RuntimeException
{
    public static function forActor(): self
    {
        return new self('You may not read or change the settings.');
    }
}

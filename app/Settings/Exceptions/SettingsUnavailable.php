<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use RuntimeException;
use Throwable;

/**
 * The stored settings of an owner could not be read, so no value is given: a default would hide the failure.
 */
final class SettingsUnavailable extends RuntimeException
{
    public static function for(string $owner, Throwable $failure): self
    {
        return new self("The settings of {$owner} could not be read.", previous: $failure);
    }
}

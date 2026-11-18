<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use LogicException;

/**
 * A setting asked of a group or snapshot it does not belong to.
 */
final class SettingUnavailable extends LogicException
{
    public static function for(string $owner, string $key): self
    {
        return new self("The setting {$key} of {$owner} is not part of what was read.");
    }
}

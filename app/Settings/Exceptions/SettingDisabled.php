<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use RuntimeException;

/**
 * A setting of a group that is switched off was changed; switch the group on first.
 */
final class SettingDisabled extends RuntimeException
{
    public static function for(string $owner, string $key, string $groupKey): self
    {
        return new self("The setting {$key} of {$owner} cannot change while its group {$groupKey} is switched off.");
    }
}

<?php

declare(strict_types=1);

namespace App\Exceptions;

use InvalidArgumentException;

/**
 * A setting or group reference whose owner or key cannot name any setting.
 */
final class SettingReferenceInvalid extends InvalidArgumentException
{
    public static function emptyOwner(): self
    {
        return new self('A settings reference names no owner.');
    }

    public static function badKey(string $owner): self
    {
        return new self(
            sprintf(
                'A settings reference of %s has a key that is not lowercase letters, digits and underscores starting with a letter.',
                $owner,
            ),
        );
    }
}

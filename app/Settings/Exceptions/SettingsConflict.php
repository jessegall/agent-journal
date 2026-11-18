<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use RuntimeException;

/**
 * A settings change made against an older revision than the stored one: read again and decide whether to retry.
 */
final class SettingsConflict extends RuntimeException
{
    public static function for(string $owner, string $key, int $expectedRevision, int $currentRevision): self
    {
        return new self("The settings of {$owner} changed since revision {$expectedRevision}; they are at revision {$currentRevision} now, so {$key} was not changed.");
    }
}

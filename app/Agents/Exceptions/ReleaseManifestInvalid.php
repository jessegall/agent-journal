<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * A published release whose manifest is not the one journal-release writes; the release folder was changed by hand.
 */
final class ReleaseManifestInvalid extends RuntimeException
{
    public static function for(string $version, string $reason): self
    {
        return new self("The manifest of release {$version} is invalid: {$reason}.");
    }
}

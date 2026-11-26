<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * A driver printed a build other than the one its profile is proven against, so no work starts on it.
 */
final class BuildNotPinned extends RuntimeException
{
    public static function of(string $driver, string $printed, string $pinned): self
    {
        return new self("{$driver} build \"{$printed}\" is not the proven build {$pinned}: refused before any work");
    }
}

<?php

declare(strict_types=1);

namespace App\Support\Compatibility;

use App\Contracts\PinnedBuilds;

/**
 * The pinned build of each driver, as its checked compatibility names it.
 */
final readonly class PinnedDriverBuilds implements PinnedBuilds
{
    public function versionOf(string $driver): string
    {
        return DriverCompatibility::pinned($driver)->version;
    }
}

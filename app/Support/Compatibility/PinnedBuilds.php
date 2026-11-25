<?php

declare(strict_types=1);

namespace App\Support\Compatibility;

use App\Contracts\Drivers\PinnedBuilds as PinnedBuildsContract;

/**
 * The pinned build of each driver, as its checked compatibility names it.
 */
final readonly class PinnedBuilds implements PinnedBuildsContract
{
    public function versionOf(string $driver): string
    {
        return DriverCompatibility::pinned($driver)->version;
    }
}

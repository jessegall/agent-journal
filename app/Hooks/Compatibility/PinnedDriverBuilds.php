<?php

declare(strict_types=1);

namespace App\Hooks\Compatibility;

use App\Agents\Contracts\PinnedBuilds;
use App\Drivers\Enums\HookDriver;

/**
 * The pinned build of each driver, as its checked compatibility names it.
 */
final readonly class PinnedDriverBuilds implements PinnedBuilds
{
    public function versionOf(HookDriver $driver): string
    {
        return DriverCompatibility::pinned($driver)->version;
    }
}

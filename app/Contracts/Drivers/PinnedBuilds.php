<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

/**
 * Names the build of each driver the journal is pinned to, which a host must run for a start to go there.
 */
interface PinnedBuilds
{
    public function versionOf(string $driver): string;
}

<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

/**
 * Names the build of each driver the journal is pinned to, which a host must run for a start to go there.
 */
interface PinnedBuilds
{
    /**
     * The build of the driver that agents run, pinned so a start never takes an untested one.
     */
    public function versionOf(string $driver): string;
}

<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Drivers\Enums\HookDriver;

/**
 * Names the build of each program the journal is pinned to, which a host must run for a start to go there.
 */
interface PinnedBuilds
{
    public function versionOf(HookDriver $driver): string;
}

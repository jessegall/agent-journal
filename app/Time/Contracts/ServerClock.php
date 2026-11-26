<?php

declare(strict_types=1);

namespace App\Time\Contracts;

use Carbon\CarbonImmutable;

/**
 * The one clock every stored time is read from: heartbeats, presence checks and frame entry times.
 */
interface ServerClock
{
    /**
     * The current time on the server.
     */
    public function now(): CarbonImmutable;
}

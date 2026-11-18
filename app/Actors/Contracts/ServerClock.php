<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use Carbon\CarbonImmutable;

/**
 * The one clock every stored time is read from: heartbeats, presence checks and frame entry times.
 */
interface ServerClock
{
    public function now(): CarbonImmutable;
}

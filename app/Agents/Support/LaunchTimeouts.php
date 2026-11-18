<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * How long a launch may send no heartbeat before it is silent, and how long it may stay silent before it times out.
 */
final readonly class LaunchTimeouts
{
    public function __construct(
        public int $silentAfterSeconds = 120,
        public int $timedOutAfterSeconds = 900,
    ) {}
}

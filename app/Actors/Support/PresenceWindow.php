<?php

declare(strict_types=1);

namespace App\Actors\Support;

/**
 * How long a heartbeat keeps an actor present, which is also an agent session's silence threshold, and how often a
 * healthy sender beats.
 */
final readonly class PresenceWindow
{
    public function __construct(
        public int $presenceSeconds,
        public int $heartbeatSeconds,
    ) {}
}

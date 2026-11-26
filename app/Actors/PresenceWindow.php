<?php

declare(strict_types=1);

namespace App\Actors;

/**
 * How long a heartbeat keeps an actor present, which is also an agent session's silence threshold, how often a
 * healthy sender beats, and how old a stored beat must be before a signed agent call records a new one.
 */
final readonly class PresenceWindow
{
    public function __construct(
        public int $presenceSeconds,
        public int $heartbeatSeconds,
        public int $signedCallRefreshSeconds,
    ) {}
}

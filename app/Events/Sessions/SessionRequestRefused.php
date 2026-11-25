<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * A start was refused for the reason given.
 */
final readonly class SessionRequestRefused implements SessionEvent
{
    public function __construct(
        public string $startId,
        public string $reason,
    ) {}
}

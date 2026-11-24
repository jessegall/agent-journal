<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A start opened its session.
 */
final readonly class StartStartedAs extends SessionEvent
{
    public function __construct(
        public string $startId,
        public string $sessionId,
    ) {}
}

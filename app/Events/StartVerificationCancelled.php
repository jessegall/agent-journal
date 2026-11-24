<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A start's verification was cancelled.
 */
final readonly class StartVerificationCancelled extends SessionEvent
{
    public function __construct(
        public string $startId,
    ) {}
}

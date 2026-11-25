<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * A start's verification was cancelled.
 */
final readonly class StartVerificationCancelled implements SessionEvent
{
    public function __construct(
        public string $startId,
    ) {}
}

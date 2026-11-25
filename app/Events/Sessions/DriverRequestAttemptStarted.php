<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request began applying at the attempt given.
 */
final readonly class DriverRequestAttemptStarted implements DriverRequestEvent, SessionEvent
{
    public function __construct(
        public string $requestId,
        public int $attempt,
    ) {}
}

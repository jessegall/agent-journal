<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request began applying at the attempt given.
 */
final readonly class DriverRequestApplying extends SessionEvent implements DriverRequestEvent
{
    public function __construct(
        public string $requestId,
        public int $attempt,
    ) {}
}

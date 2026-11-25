<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request was accepted by its host.
 */
final readonly class DriverRequestAccepted implements DriverRequestEvent, SessionEvent
{
    public function __construct(
        public string $requestId,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request was accepted by its host.
 */
final readonly class DriverRequestAccepted extends SessionEvent implements DriverRequestEvent
{
    public function __construct(
        public string $requestId,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request was tried again.
 */
final readonly class DriverRequestRetried extends SessionEvent implements DriverRequestEvent
{
    public function __construct(
        public string $requestId,
    ) {}
}

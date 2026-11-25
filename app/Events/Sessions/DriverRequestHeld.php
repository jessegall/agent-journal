<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;
use App\Enums\Drivers\HoldReason;

/**
 * A driver request was held for the reason given.
 */
final readonly class DriverRequestHeld extends SessionEvent implements DriverRequestEvent
{
    public function __construct(
        public string $requestId,
        public HoldReason $reason,
    ) {}
}

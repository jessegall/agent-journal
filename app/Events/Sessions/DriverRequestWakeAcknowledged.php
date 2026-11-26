<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;

/**
 * A wake was acknowledged up to the watermark given.
 */
final readonly class DriverRequestWakeAcknowledged implements DriverRequestEvent, SessionEvent
{
    public function __construct(
        public string $requestId,
        public int $acknowledged,
    ) {}
}

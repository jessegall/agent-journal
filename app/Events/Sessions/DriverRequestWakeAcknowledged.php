<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A wake was acknowledged up to the watermark given.
 */
final readonly class DriverRequestWakeAcknowledged extends SessionEvent implements DriverRequestEvent
{
    public function __construct(
        public string $requestId,
        public int $acknowledged,
    ) {}
}

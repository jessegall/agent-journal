<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A host claimed a wake up to the watermark given.
 */
final readonly class DriverRequestWakeClaimed extends SessionEvent implements DriverRequestEvent
{
    public function __construct(
        public string $requestId,
        public int $requested,
    ) {}
}

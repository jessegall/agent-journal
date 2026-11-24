<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\ProcessStartEvent;

/**
 * A process start was seen to stop.
 */
final readonly class ProcessStartStopped extends SessionEvent implements ProcessStartEvent
{
    public function __construct(public string $startId) {}
}

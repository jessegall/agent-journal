<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\ProcessStartEvent;

/**
 * A process start was called off before it started.
 */
final readonly class ProcessStartCancelled extends SessionEvent implements ProcessStartEvent
{
    public function __construct(public string $startId) {}
}

<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\ProcessStartEvent;

/**
 * A process start runs, under the execution given.
 */
final readonly class ProcessStartRunning extends SessionEvent implements ProcessStartEvent
{
    public function __construct(public string $startId, public string $executionId) {}
}

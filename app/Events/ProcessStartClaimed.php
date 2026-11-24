<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\ProcessStartEvent;

/**
 * A host took a pending process start and starts it.
 */
final readonly class ProcessStartClaimed extends SessionEvent implements ProcessStartEvent
{
    public function __construct(public string $startId) {}
}

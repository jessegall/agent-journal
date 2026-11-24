<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\ProcessStartEvent;

/**
 * A process start began a new generation of its output.
 */
final readonly class ProcessStartOutputAdvanced extends SessionEvent implements ProcessStartEvent
{
    public function __construct(public string $startId, public int $generation) {}
}

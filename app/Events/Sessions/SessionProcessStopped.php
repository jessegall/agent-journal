<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\StartEndEvent;

/**
 * A process start was seen to stop.
 */
final readonly class SessionProcessStopped implements SessionEvent, StartEndEvent
{
    public function __construct(public string $startId) {}
}

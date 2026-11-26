<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\SessionProcessEvent;

/**
 * A process start was seen to stop.
 */
final readonly class SessionProcessStopped implements SessionEvent, SessionProcessEvent
{
    public function __construct(public string $startId) {}
}

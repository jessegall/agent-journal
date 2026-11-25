<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\SessionProcessEvent;

/**
 * A process start runs, under the execution given.
 */
final readonly class SessionProcessSeenRunning implements SessionEvent, SessionProcessEvent
{
    public function __construct(public string $startId, public string $executionId) {}
}

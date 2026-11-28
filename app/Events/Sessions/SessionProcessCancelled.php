<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\StartEndEvent;

/**
 * A process start was called off before it started.
 */
final readonly class SessionProcessCancelled implements SessionEvent, StartEndEvent
{
    public function __construct(public string $startId) {}
}

<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\SessionProcessEvent;

/**
 * A process start was called off before it started.
 */
final readonly class SessionProcessCancelled extends SessionEvent implements SessionProcessEvent
{
    public function __construct(public string $startId) {}
}

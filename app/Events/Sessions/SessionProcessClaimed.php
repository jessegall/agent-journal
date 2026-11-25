<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\SessionProcessEvent;

/**
 * A host took a pending process start and starts it.
 */
final readonly class SessionProcessClaimed implements SessionEvent, SessionProcessEvent
{
    public function __construct(public string $startId) {}
}

<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\SessionProcessEvent;

/**
 * A start of a session was registered and waits for its process.
 */
final readonly class SessionProcessRegistered implements SessionEvent, SessionProcessEvent
{
    public function __construct(public string $startId, public string $sessionId) {}
}

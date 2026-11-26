<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\StopCheckEvent;

/**
 * A stop opened its attempt, whose conditions now run on the session's host.
 */
final readonly class StopCheckOpened implements SessionEvent, StopCheckEvent
{
    public function __construct(public string $attemptId, public string $sessionId) {}
}

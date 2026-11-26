<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\SessionProcessEvent;

/**
 * A process start began a new generation of its output.
 */
final readonly class SessionProcessOutputAdvanced implements SessionEvent, SessionProcessEvent
{
    public function __construct(public string $startId, public int $generation) {}
}

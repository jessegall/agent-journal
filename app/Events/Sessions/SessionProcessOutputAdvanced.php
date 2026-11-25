<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\SessionProcessEvent;

/**
 * A process start began a new generation of its output.
 */
final readonly class SessionProcessOutputAdvanced extends SessionEvent implements SessionProcessEvent
{
    public function __construct(public string $startId, public int $generation) {}
}

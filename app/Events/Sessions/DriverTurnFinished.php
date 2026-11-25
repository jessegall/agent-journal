<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * A driver turn finished with its outcome.
 */
final readonly class DriverTurnFinished implements SessionEvent
{
    public function __construct(
        public string $turnId,
        public string $outcome,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A driver turn finished with its outcome.
 */
final readonly class DriverTurnFinished extends SessionEvent
{
    public function __construct(
        public string $turnId,
        public string $outcome,
    ) {}
}

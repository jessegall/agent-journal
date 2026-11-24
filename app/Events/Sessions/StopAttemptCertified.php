<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\StopAttemptEvent;

/**
 * A stop attempt was certified.
 */
final readonly class StopAttemptCertified extends SessionEvent implements StopAttemptEvent
{
    public function __construct(
        public string $attemptId,
    ) {}
}

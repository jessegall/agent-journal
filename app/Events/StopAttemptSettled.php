<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\StopAttemptEvent;
use App\Enums\StopAttemptState;

/**
 * A stop attempt was settled in the state given.
 */
final readonly class StopAttemptSettled extends SessionEvent implements StopAttemptEvent
{
    public function __construct(
        public string $attemptId,
        public StopAttemptState $state,
    ) {}
}

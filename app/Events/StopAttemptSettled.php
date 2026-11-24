<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\StopAttemptEvent;
use App\Enums\StopAttemptState;

/**
 * A stop attempt was settled in the state given; its outcome is the same for two attempts that settled alike, with
 * the same failures under the same policy and workspace generation.
 */
final readonly class StopAttemptSettled extends SessionEvent implements StopAttemptEvent
{
    public function __construct(
        public string $attemptId,
        public StopAttemptState $state,
        public string $outcome,
    ) {}
}

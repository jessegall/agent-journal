<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\StopCheckEvent;
use App\Enums\Sessions\StopCheckState;

/**
 * A stop attempt was settled in the state given; its outcome is the same for two attempts that settled alike, with
 * the same failures under the same policy and workspace generation.
 */
final readonly class StopCheckSettled extends SessionEvent implements StopCheckEvent
{
    public function __construct(
        public string $attemptId,
        public StopCheckState $state,
        public string $outcome,
    ) {}
}

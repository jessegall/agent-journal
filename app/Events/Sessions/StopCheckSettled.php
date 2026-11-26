<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\StopCheckEvent;
use App\Sessions\Enums\StopCheckStatus;

/**
 * A stop attempt was settled in the state given; its outcome is the same for two attempts that settled alike, with
 * the same failures under the same policy and workspace generation.
 */
final readonly class StopCheckSettled implements SessionEvent, StopCheckEvent
{
    public function __construct(
        public string $attemptId,
        public StopCheckStatus $status,
        public string $outcome,
    ) {}
}

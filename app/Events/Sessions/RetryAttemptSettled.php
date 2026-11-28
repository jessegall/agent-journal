<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Enums\RetryOutcome;

/** A retry recorded its outcome. */
final readonly class RetryAttemptSettled implements SessionEvent
{
    public function __construct(public string $retryAttemptId, public RetryOutcome $outcome) {}
}

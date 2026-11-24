<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Work\MergeAttemptEvent;

/**
 * A merge attempt's outcome became uncertain.
 */
final readonly class MergeAttemptUncertain extends ReviewEvent implements MergeAttemptEvent
{
    public function __construct(
        public string $attemptId,
    ) {}
}

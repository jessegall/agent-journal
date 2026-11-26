<?php

declare(strict_types=1);

namespace App\Hooks;

use App\Hooks\Exceptions\RetentionTooShort;

/**
 * How long hook history is kept: answered calls, stacks after they closed and the raw output of stop conditions,
 * whose summaries stay. Active stacks are never pruned.
 */
final readonly class RetentionPeriods
{
    public function __construct(
        public int $hookCallDays = 7,
        public int $closedStackDays = 30,
        public int $batchSize = 500,
        public int $stopOutputDays = 7,
    ) {}

    /**
     * Refuses a call retention that a retry could outlive: a deleted call must be too old to be retried as new.
     */
    public function assertLongerThan(HookRetryWindow $retryWindow): void
    {
        if ($this->hookCallDays * 86400 <= $retryWindow->seconds) {
            throw RetentionTooShort::forDays($this->hookCallDays, $retryWindow->seconds);
        }
    }
}

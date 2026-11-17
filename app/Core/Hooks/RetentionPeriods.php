<?php

declare(strict_types=1);

namespace App\Core\Hooks;

/**
 * How long hook history is kept: answered calls, and stacks after they closed. Active stacks are never pruned.
 */
final readonly class RetentionPeriods
{
    public function __construct(
        public int $hookCallDays = 7,
        public int $closedStackDays = 30,
        public int $batchSize = 500,
    ) {}

    /**
     * Refuses a call retention that a retry could outlive: a deleted call must be too old to be retried as new.
     */
    public function checkLongerThan(HookRetryWindow $retryWindow): void
    {
        if ($this->hookCallDays * 86400 <= $retryWindow->seconds) {
            throw RetentionTooShort::forDays($this->hookCallDays, $retryWindow->seconds);
        }
    }
}

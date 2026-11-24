<?php

declare(strict_types=1);

namespace App\Events\Reviews;

use App\Contracts\Work\MergeAttemptEvent;

/**
 * A merge attempt's outcome became uncertain.
 */
final readonly class MergeAttemptBecameUncertain extends ReviewEvent implements MergeAttemptEvent
{
    public function __construct(
        public string $attemptId,
    ) {}
}

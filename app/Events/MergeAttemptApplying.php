<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Work\MergeAttemptEvent;

/**
 * A merge attempt began applying onto its target.
 */
final readonly class MergeAttemptApplying extends ReviewEvent implements MergeAttemptEvent
{
    public function __construct(
        public string $attemptId,
    ) {}
}

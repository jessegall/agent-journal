<?php

declare(strict_types=1);

namespace App\Events\Reviews;

use App\Contracts\Work\MergeAttemptEvent;

/**
 * A merge attempt was acknowledged.
 */
final readonly class MergeAttemptAcknowledged extends ReviewEvent implements MergeAttemptEvent
{
    public function __construct(
        public string $attemptId,
    ) {}
}

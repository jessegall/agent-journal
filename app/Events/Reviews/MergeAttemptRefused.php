<?php

declare(strict_types=1);

namespace App\Events\Reviews;

use App\Contracts\Work\MergeAttemptEvent;
use App\Enums\MergeRefusalReason;

/**
 * A merge attempt was refused for the reason given.
 */
final readonly class MergeAttemptRefused extends ReviewEvent implements MergeAttemptEvent
{
    public function __construct(
        public string $attemptId,
        public MergeRefusalReason $reason,
    ) {}
}

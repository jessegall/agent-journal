<?php

declare(strict_types=1);

namespace App\Events\Reviews;

use App\Contracts\Work\MergeAttemptEvent;
use App\Enums\MergeAttemptState;

/**
 * The owner resolved a merge attempt in the state given.
 */
final readonly class MergeAttemptResolvedByOwner extends ReviewEvent implements MergeAttemptEvent
{
    public function __construct(
        public string $attemptId,
        public MergeAttemptState $state,
    ) {}
}

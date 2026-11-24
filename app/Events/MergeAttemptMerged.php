<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Work\MergeAttemptEvent;

/**
 * A merge attempt merged, with the commit it produced.
 */
final readonly class MergeAttemptMerged extends ReviewEvent implements MergeAttemptEvent
{
    public function __construct(
        public string $attemptId,
        public string $result,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Hooks\Events;

use App\Contracts\Event;
use App\Hooks\Values\StopAttemptReference;
use App\Records\Support\RecordIdentity;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A started agent's stop passed every final check of its policy, so the work it was started for is complete; the
 * passed attempt is the certificate. Raised once per attempt, after the transaction committed.
 */
final readonly class HelperCompletionCertified implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public RecordIdentity $work,
        public StopAttemptReference $attempt,
    ) {}
}

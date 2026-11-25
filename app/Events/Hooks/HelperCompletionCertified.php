<?php

declare(strict_types=1);

namespace App\Events\Hooks;

use App\Support\RecordIdentity;
use App\Values\StopCheckReference;

/**
 * A started agent's stop passed every final check of its policy, so the work it was started for is complete; the
 * passed attempt is the certificate. Raised once per attempt, after the transaction committed.
 */
final readonly class HelperCompletionCertified implements HookEvent
{
    public function __construct(
        public RecordIdentity $work,
        public StopCheckReference $attempt,
    ) {}
}

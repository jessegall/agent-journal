<?php

declare(strict_types=1);

namespace App\Hooks\Events;

use App\Contracts\Event;
use App\Hooks\Values\StopAttemptReference;
use App\Records\Support\RecordIdentity;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A started agent failed its final checks three times in a row with the same failures and no change in between, so
 * its work is held for repair instead of asking it again. Raised once, with the last failed attempt.
 */
final readonly class HelperStopHeld implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public RecordIdentity $work,
        public StopAttemptReference $attempt,
    ) {}
}

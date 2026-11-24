<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Tasks\Events;

use App\Attributes\TransactionListenerConsent;
use App\Contracts\Events\Event;

/**
 * A fact whose write owner declares that a Plans listener enforces an invariant of it.
 */
#[TransactionListenerConsent]
final readonly class TaskClaimed implements Event {}

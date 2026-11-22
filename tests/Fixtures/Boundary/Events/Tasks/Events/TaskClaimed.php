<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Tasks\Events;

use App\Attributes\RequiresTransactionListener;
use App\Contracts\Events\Event;
use Tests\Fixtures\Boundary\Events\Plans\Listeners\TransactionClaimListener;

/**
 * A fact whose write owner declares that a Plans listener enforces an invariant of it.
 */
#[RequiresTransactionListener(TransactionClaimListener::class)]
final readonly class TaskClaimed implements Event {}

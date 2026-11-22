<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Tasks\Events;

use App\Attributes\RequiresListener;
use App\Contracts\Event;
use Tests\Fixtures\Boundary\Events\Plans\Listeners\RequiredClaimListener;

/**
 * A fact whose write owner declares that a Plans listener enforces an invariant of it.
 */
#[RequiresListener(RequiredClaimListener::class)]
final readonly class TaskClaimed implements Event {}

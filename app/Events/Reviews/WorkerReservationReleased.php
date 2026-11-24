<?php

declare(strict_types=1);

namespace App\Events\Reviews;

use App\Contracts\Work\WorkerReservationEvent;

/**
 * A worker reservation let go of a piece of work.
 */
final readonly class WorkerReservationReleased extends ReviewEvent implements WorkerReservationEvent
{
    public function __construct(
        public string $reservationId,
    ) {}
}

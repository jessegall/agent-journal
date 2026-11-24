<?php

declare(strict_types=1);

namespace App\Events\Reviews;

use App\Contracts\Work\WorkerReservationEvent;

/**
 * A worker reservation was taken for a piece of work.
 */
final readonly class WorkerReservationOccupied extends ReviewEvent implements WorkerReservationEvent
{
    public function __construct(
        public string $reservationId,
    ) {}
}

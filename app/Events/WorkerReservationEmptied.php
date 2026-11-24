<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Work\WorkerReservationEvent;

/**
 * A worker reservation let go of all its work.
 */
final readonly class WorkerReservationEmptied extends ReviewEvent implements WorkerReservationEvent
{
    public function __construct(
        public string $reservationId,
    ) {}
}

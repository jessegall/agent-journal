<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Work\WorkReservationEvent;

/**
 * A work reservation was released.
 */
final readonly class WorkReservationReleased extends ReviewEvent implements WorkReservationEvent
{
    public function __construct(
        public string $reservationId,
    ) {}
}

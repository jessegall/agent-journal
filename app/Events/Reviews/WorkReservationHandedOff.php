<?php

declare(strict_types=1);

namespace App\Events\Reviews;

use App\Contracts\Work\WorkReservationEvent;

/**
 * A work reservation was handed off.
 */
final readonly class WorkReservationHandedOff extends ReviewEvent implements WorkReservationEvent
{
    public function __construct(
        public string $reservationId,
    ) {}
}

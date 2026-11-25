<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Sessions\ReservationStatus;
use App\Models\Sessions\CapacityReservation;

/**
 * Gives back the host capacity a start reserved, once the start is over.
 */
final readonly class CapacityRelease
{
    /**
     * Gives the start's share back once its exit is confirmed; releasing it again changes nothing.
     */
    public function releaseFor(string $startRequestId): void
    {
        CapacityReservation::query()
            ->ofStartRequest($startRequestId)
            ->withState(ReservationStatus::Reserved)
            ->update(['status' => ReservationStatus::Released]);
    }
}

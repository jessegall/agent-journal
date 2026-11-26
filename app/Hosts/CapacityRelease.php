<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Models\Sessions\CapacityReservation;
use App\Sessions\Enums\ReservationStatus;

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

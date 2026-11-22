<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Desk;

/**
 * The desk, its inbox and the seat of a seat change, and the exact assignment that seats the actor now.
 */
final readonly class SeatChangeResult
{
    public function __construct(
        public string $deskId,
        public string $inboxId,
        public string $seatId,
        public AssignmentReference $reference,
    ) {}

    public static function at(Desk $desk, string $seatId, AssignmentReference $reference): self
    {
        return new self($desk->deskId(), $desk->inboxId(), $seatId, $reference);
    }
}

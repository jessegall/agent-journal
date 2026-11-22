<?php

declare(strict_types=1);

namespace App\Support;

/**
 * A request to give a desk's seat to another actor, naming the seat's assignment as the caller read it.
 */
final readonly class SeatChange
{
    public function __construct(
        public string $deskId,
        public string $seatId,
        public AssignmentReference $expected,
        public ActorIdentity $actor,
    ) {}
}

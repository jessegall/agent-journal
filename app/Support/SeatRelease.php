<?php

declare(strict_types=1);

namespace App\Support;

/**
 * A request to empty a desk's seat, naming the seat's assignment as the caller read it.
 */
final readonly class SeatRelease
{
    public function __construct(
        public string $deskId,
        public string $seatId,
        public AssignmentReference $expected,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A seat change that names an assignment the seat no longer has.
 */
final class SeatConflict extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forSeat(string $seatId): self
    {
        return new self("Seat {$seatId} changed since it was read; read it again.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}

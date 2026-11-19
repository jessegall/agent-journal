<?php

declare(strict_types=1);

namespace App\Desks\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
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

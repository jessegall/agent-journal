<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * One public answer for a desk or seat that does not exist and one the actor may not use.
 */
final class DeskUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forId(string $deskId): self
    {
        return new self("Desk {$deskId} is not available.");
    }

    public static function forSeat(string $seatId): self
    {
        return new self("Seat {$seatId} is not available.");
    }

    protected function status(): int
    {
        return 404;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}

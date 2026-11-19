<?php

declare(strict_types=1);

namespace App\Desks\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A seating at a desk whose seats are all taken.
 */
final class SeatCapacityReached extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forDesk(string $deskId): self
    {
        return new self("Every seat of desk {$deskId} is taken.");
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

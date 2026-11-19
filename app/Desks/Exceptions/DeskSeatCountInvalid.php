<?php

declare(strict_types=1);

namespace App\Desks\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A desk asked for with no seats or more than a hundred.
 */
final class DeskSeatCountInvalid extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(int $seatCount): self
    {
        return new self("A desk has between 1 and 100 seats; {$seatCount} were asked for.");
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}

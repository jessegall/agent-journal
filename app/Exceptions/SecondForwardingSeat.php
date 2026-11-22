<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A seating that would give an actor a second seat its work and messages forward to.
 */
final class SecondForwardingSeat extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forDesk(string $deskId): self
    {
        return new self("The actor already forwards to another desk, so it cannot also forward to desk {$deskId}.");
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

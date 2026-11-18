<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A share asked to last fewer minutes than one or more than thirty days.
 */
final class ShareDurationInvalid extends InvalidArgumentException implements CommandRefusal
{
    use RendersRefusal;

    public static function of(int $minutes, int $fewest, int $most): self
    {
        return new self("A share lasts {$fewest} to {$most} minutes; {$minutes} is outside that.");
    }

    protected function status(): int
    {
        return 422;
    }
}

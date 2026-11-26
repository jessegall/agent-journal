<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use InvalidArgumentException;

/**
 * A share asked to last fewer minutes than one or more than thirty days.
 */
final class ShareDurationInvalid extends InvalidArgumentException implements CodedRefusal, CommandRefusal
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

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}

<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Processes\Values\TimingVerdict;
use RuntimeException;

/**
 * A test or check was refused before anything started because the caller's plan phase is not written yet.
 */
final class PhaseTimingRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function by(TimingVerdict $verdict): self
    {
        return new self($verdict->reason().' Nothing in this request started.');
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}

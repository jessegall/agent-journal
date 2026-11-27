<?php

declare(strict_types=1);

namespace App\Hosts\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A driver's command line names what host protocol 1 does not declare for its program.
 */
final class ProgramLineRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function undeclared(string $program, string $argument): self
    {
        return new self("The {$program} line names {$argument}, which host protocol 1 does not declare for it.");
    }

    public static function missingValue(string $program, string $argument): self
    {
        return new self("The {$program} line ends at {$argument}, which takes a value.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    protected function status(): int
    {
        return 422;
    }
}

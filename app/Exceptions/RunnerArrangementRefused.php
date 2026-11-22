<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\ArrangementType;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A sign-in runner of the other arrangement asked for work, refused before anything is claimed.
 */
final class RunnerArrangementRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function between(ArrangementType $journal, ArrangementType $runner): self
    {
        return new self(
            "This journal runs in the {$journal->value} arrangement; the sign-in runner reports {$runner->value}.",
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 409;
    }
}

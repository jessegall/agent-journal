<?php

declare(strict_types=1);

namespace App\Hosts\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Projects\Enums\ArrangementType;
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

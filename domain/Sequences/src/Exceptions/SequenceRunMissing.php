<?php

declare(strict_types=1);

namespace Domain\Sequences\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

final class SequenceRunMissing extends RuntimeException implements CommandRefusal
{
    public static function forId(string $runId): self
    {
        return new self("Sequence run {$runId} does not exist.");
    }
}

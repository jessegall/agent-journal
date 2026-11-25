<?php

declare(strict_types=1);

namespace Domain\Sequences\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

final class SequenceRunMissing extends RuntimeException implements CommandRefusal
{
    /** @use ThrowsLater<SequenceRunMissing> */
    use ThrowsLater;

    public static function forId(string $runId): self
    {
        return new self("Sequence run {$runId} does not exist.");
    }

    public static function forNumber(int $number): self
    {
        return new self("Sequence run {$number} does not exist, or you may not read it.");
    }
}

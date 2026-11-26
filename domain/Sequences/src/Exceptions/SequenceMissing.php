<?php

declare(strict_types=1);

namespace Domain\Sequences\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

final class SequenceMissing extends RuntimeException implements CommandRefusal
{
    /**
     * @use ThrowsLater<SequenceMissing>
     */
    use ThrowsLater;

    public static function forId(string $sequenceId): self
    {
        return new self("Sequence {$sequenceId} does not exist.");
    }
}

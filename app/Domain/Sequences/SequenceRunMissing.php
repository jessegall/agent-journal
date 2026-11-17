<?php

declare(strict_types=1);

namespace App\Domain\Sequences;

use RuntimeException;

final class SequenceRunMissing extends RuntimeException
{
    public static function forId(int $runId): self
    {
        return new self("Sequence run {$runId} does not exist.");
    }
}

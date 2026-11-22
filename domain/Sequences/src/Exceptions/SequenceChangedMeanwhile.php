<?php

declare(strict_types=1);

namespace Domain\Sequences\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

final class SequenceChangedMeanwhile extends RuntimeException implements CommandRefusal
{
    public static function since(int $opened, int $current): self
    {
        return new self("The sequence changed since you opened it (version {$opened}, now {$current}); open it again.");
    }
}

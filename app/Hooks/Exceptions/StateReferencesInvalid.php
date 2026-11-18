<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use InvalidArgumentException;

/**
 * A batch of state references larger than one read may answer.
 */
final class StateReferencesInvalid extends InvalidArgumentException
{
    public static function tooMany(int $count): self
    {
        return new self("A batch holds at most 100 state references, not {$count}; split it first.");
    }
}

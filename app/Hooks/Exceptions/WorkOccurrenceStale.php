<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use App\Hooks\Values\WorkOccurrence;
use RuntimeException;

final class WorkOccurrenceStale extends RuntimeException
{
    public static function for(WorkOccurrence $occurrence): self
    {
        return new self("The work of {$occurrence->description()} is over, so a tick of it may change nothing.");
    }
}

<?php

declare(strict_types=1);

namespace App\Core\Hooks\States;

use App\Core\Hooks\Decisions\StateReference;
use RuntimeException;
use Throwable;

/**
 * A stored state names a subject its domain cannot read for this request; the frame is not silently dropped.
 */
final class StateSubjectMissing extends RuntimeException
{
    public static function for(StateReference $reference, ?Throwable $cause = null): self
    {
        return new self("The subject of the state {$reference->typeKey} cannot be read for this request.", previous: $cause);
    }
}

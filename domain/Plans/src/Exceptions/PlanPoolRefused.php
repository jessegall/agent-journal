<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A reference to the pool of a plan's tasks whose shape does not fit: another pool, no plan as its target, or a list.
 */
final class PlanPoolRefused extends InvalidArgumentException implements CommandRefusal
{
    public static function otherPool(string $expectedKey): self
    {
        return new self("This reference does not name the pool {$expectedKey}.");
    }

    public static function noPlanTarget(string $key): self
    {
        return new self("The pool {$key} needs one plan as its target.");
    }

    public static function idsGiven(string $key): self
    {
        return new self("The pool {$key} holds the tasks of its plan; it takes no list of tasks.");
    }
}

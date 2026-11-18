<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Processes\Enums\LifecycleState;
use LogicException;

/**
 * A part was asked to move to a lifecycle state it cannot reach from where it is.
 */
final class PartTransitionRefused extends LogicException
{
    public static function between(LifecycleState $from, LifecycleState $to): self
    {
        return new self("A part that is {$from->value} cannot become {$to->value}.");
    }

    public static function notDrained(): self
    {
        return new self('A part ends only once its process ended and its streams are drained.');
    }
}

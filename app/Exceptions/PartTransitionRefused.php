<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\Runs\LifecycleStatus;
use LogicException;

/**
 * A part was asked to move to a lifecycle state it cannot reach from where it is.
 */
final class PartTransitionRefused extends LogicException
{
    public static function between(LifecycleStatus $from, LifecycleStatus $to): self
    {
        return new self("A part that is {$from->value} cannot become {$to->value}.");
    }

    public static function notDrained(): self
    {
        return new self('A part ends only once its process ended and its streams are drained.');
    }
}

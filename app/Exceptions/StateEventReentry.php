<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Values\StackTarget;
use LogicException;

final class StateEventReentry extends LogicException
{
    public static function duringEvaluation(StackTarget $target): self
    {
        return new self('A state event cannot reenter an evaluating stack for '.$target->description().'.');
    }

    public static function cycle(StackTarget $target, string $frame, string $event): self
    {
        return new self("A state event cycle reached {$event} on frame {$frame} of ".$target->description().'.');
    }

    public static function depth(int $maximum): self
    {
        return new self("State event delivery can nest at most {$maximum} levels.");
    }

    public static function outsideDelivery(): self
    {
        return new self('A state event origin requires an active delivery.');
    }
}

<?php

declare(strict_types=1);

namespace App\Stacks\Exceptions;

use LogicException;

/**
 * A state answered a hook with something its caller does not take.
 */
final class HookAnswerRefused extends LogicException
{
    public static function afterDecision(string $state, string $hook): self
    {
        return new self("{$state} yielded more after its decision on {$hook}. The decision must be the last thing.");
    }

    public static function allowIsPassing(string $state, string $hook): self
    {
        return new self("{$state} answered {$hook} with allow. A state that lets the hook through returns nothing.");
    }

    public static function notAnAnswer(string $state, string $hook, string $answer): self
    {
        return new self(
            "{$state} answered {$hook} with {$answer}. A state answers with nothing, a decision, a command, an event,"
            .' a context line or a message line, or yields several with the decision last.',
        );
    }
}

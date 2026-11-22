<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A state answered a hook or a fact with something its caller does not run.
 */
final class StateAnswerRefused extends LogicException
{
    public static function tooMany(string $listener, int $count, int $most): self
    {
        return new self("{$listener} returned {$count} commands and events. A listener can return at most {$most}.");
    }

    public static function notApplicationCommand(string $command): self
    {
        return new self("{$command} is not an application command, so no state may answer with it.");
    }

    public static function notAnEffect(string $listener, string $answer): self
    {
        return new self("{$listener} returned {$answer}. A listener returns nothing, a command, an event, or several.");
    }
}

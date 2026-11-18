<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Support\StackTarget;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A driver request refused before it is accepted, so nothing of it is stored.
 */
final class DriverRequestRefused extends RuntimeException implements CommandRefusal
{
    public static function noRuntime(StackTarget $target): self
    {
        return new self("Agent {$target->agentId} has no runtime in session {$target->sessionId}.");
    }

    public static function stopping(StackTarget $target): self
    {
        return new self("The runtime of session {$target->sessionId} is stopping and takes no more requests.");
    }

    public static function keyConflict(string $key): self
    {
        return new self("The request key {$key} was already used with other content.");
    }

    /**
     * @param  list<string>  $supported
     */
    public static function unsupportedEffort(string $effort, array $supported): self
    {
        return new self("The effort {$effort} is not supported; choose one of ".implode(', ', $supported).'.');
    }

    public static function emptyModel(): self
    {
        return new self('A model change needs a model name.');
    }
}

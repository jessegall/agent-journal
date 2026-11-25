<?php

declare(strict_types=1);

namespace Tests\Support\Bus\Exceptions;

use LogicException;

/**
 * A reply arranged for a sunk command that its handler could not have given: none for a handler that returns a
 * value, one of another type, or any reply for a handler that returns nothing.
 */
final class SunkReplyRefused extends LogicException
{
    public static function missing(string $command, string $type): self
    {
        return new self("{$command} was sunk with no reply, but its handler returns {$type}: arrange one with reply().");
    }

    public static function ofAnotherType(string $command, string $type, string $given): self
    {
        return new self("The reply arranged for {$command} is {$given}, but its handler returns {$type}.");
    }

    public static function forVoid(string $command): self
    {
        return new self("{$command} returns nothing, so no reply is arranged for it.");
    }
}

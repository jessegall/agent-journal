<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A reserved instruction command that did not come from a frame allowed to ask for it: dispatched directly, from the
 * wrong callback or state type, or naming another subject than its frame's.
 */
final class InstructionOriginRefused extends RuntimeException implements CommandRefusal
{
    public static function missing(string $command): self
    {
        return new self("{$command} runs only as a frame's lifecycle answer, run by the engine.");
    }

    public static function notAllowed(string $command, string $origin): self
    {
        return new self("{$command} may not come from {$origin}.");
    }

    public static function otherSubject(string $command, string $origin): self
    {
        return new self("{$command} names another plan than {$origin} works on.");
    }
}

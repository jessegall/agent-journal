<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A reference to a pool of tasks whose shape does not fit the pool. The message names no task, so nothing a caller
 * sent is echoed back.
 */
final class TaskPoolRefused extends InvalidArgumentException implements CommandRefusal
{
    public static function otherPool(string $expectedKey): self
    {
        return new self("This reference does not name the pool {$expectedKey}.");
    }

    public static function targetGiven(string $key): self
    {
        return new self("The pool {$key} is about no record; leave its target out.");
    }

    public static function idsGiven(string $key): self
    {
        return new self("The pool {$key} holds every open task; it takes no list of tasks.");
    }

    public static function noIds(string $key): self
    {
        return new self("The pool {$key} needs at least one task.");
    }
}

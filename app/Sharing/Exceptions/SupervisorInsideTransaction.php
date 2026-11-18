<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use RuntimeException;

/**
 * The sharing supervisor was about to run a gateway's program while a database transaction was open.
 */
final class SupervisorInsideTransaction extends RuntimeException
{
    public static function atLevel(int $level): self
    {
        return new self("A gateway's program runs outside every transaction, but {$level} were open; the supervisor stops.");
    }
}

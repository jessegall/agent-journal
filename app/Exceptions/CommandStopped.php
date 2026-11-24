<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Support\CallKey;
use RuntimeException;

/**
 * A failure that stops a console command: it says what to print and, for a keyed write, the key to send it again
 * under.
 */
abstract class CommandStopped extends RuntimeException
{
    /**
     * The lines a console command prints for this failure.
     *
     * @return list<string>
     */
    public function consoleLines(): array
    {
        return [$this->getMessage()];
    }

    /**
     * The key a retry of the stopped command runs under; none when it is not retried.
     */
    public function retryKey(): CallKey|null
    {
        return null;
    }
}

<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

use App\AgentRequests\Support\CallKey;
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

    public function retryKey(): CallKey|null
    {
        return null;
    }
}

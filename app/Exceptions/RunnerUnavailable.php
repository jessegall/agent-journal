<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * The supervised runner is not available on this host, so nothing starts.
 */
final class RunnerUnavailable extends RuntimeException
{
    public static function switchedOff(): self
    {
        return new self('runner-unavailable: this host does not run admitted command lines (processes.runner is off).');
    }
}

<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * Incoming work failed before the stack was touched; the hook answers that the service is unavailable and nothing
 * of the hook is saved.
 */
final class IncomingWorkFailed extends RuntimeException
{
    public static function forWork(string $class, Throwable $cause): self
    {
        return new self("The incoming work {$class} failed: {$cause->getMessage()}", 0, $cause);
    }
}

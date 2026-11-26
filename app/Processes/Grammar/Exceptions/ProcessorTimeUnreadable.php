<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Exceptions;

use RuntimeException;

/**
 * The operating system did not say how much processor time this process spent, so an analysis cannot be timed.
 */
final class ProcessorTimeUnreadable extends RuntimeException
{
    public static function forThisProcess(): self
    {
        return new self('The processor time of this process could not be read, so a shell line cannot be analysed.');
    }
}

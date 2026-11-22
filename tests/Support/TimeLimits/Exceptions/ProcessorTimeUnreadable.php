<?php

declare(strict_types=1);

namespace Tests\Support\TimeLimits\Exceptions;

use RuntimeException;

/**
 * The system would not say how much processor time the test process has spent, so its time limit cannot be judged.
 */
final class ProcessorTimeUnreadable extends RuntimeException
{
    public static function fromSystem(): self
    {
        return new self('getrusage() failed, so the processor time of the running test cannot be read.');
    }
}

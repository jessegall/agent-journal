<?php

declare(strict_types=1);

namespace App\Values;

/**
 * How a process on a host ended, with the proof the host gave.
 */
final readonly class ProcessExit
{
    public function __construct(
        public int|null $exitCode,
        public string|null $signal,
        public string $evidence,
    ) {}
}

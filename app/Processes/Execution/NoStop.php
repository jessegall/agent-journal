<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\Processes\Contracts\StopSignal;

/**
 * The stop signal of a run nobody can stop from outside.
 */
final readonly class NoStop implements StopSignal
{
    public function isRequested(): bool
    {
        return false;
    }

    public function reason(): string
    {
        return 'no stop was requested';
    }
}

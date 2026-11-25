<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Contracts\Processes\StopSignal as StopSignalContract;

/**
 * The stop signal of a run nobody can stop from outside.
 */
final readonly class StopSignal implements StopSignalContract
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

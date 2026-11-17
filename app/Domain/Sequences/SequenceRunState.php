<?php

declare(strict_types=1);

namespace App\Domain\Sequences;

/**
 * Where one run of a sequence stands, as the stack sees it.
 */
enum SequenceRunState: string
{
    case Running = 'running';
    case Finished = 'finished';
    case Cancelled = 'cancelled';

    public function needsWork(): bool
    {
        return $this === self::Running;
    }
}

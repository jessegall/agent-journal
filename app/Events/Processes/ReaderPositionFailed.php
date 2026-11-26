<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\ReaderPositionEvent;

/**
 * A reader failed on a run's output, so its interpretation stops there.
 */
final readonly class ReaderPositionFailed implements ProcessEvent, ReaderPositionEvent
{
    public function __construct(
        public string $positionId,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\ReaderPositionEvent;

/**
 * A reader's position moved on to a later checkpoint.
 */
final readonly class ReaderPositionAdvanced implements ProcessEvent, ReaderPositionEvent
{
    public function __construct(
        public string $positionId,
    ) {}
}

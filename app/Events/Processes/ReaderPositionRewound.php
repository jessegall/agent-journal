<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\ReaderPositionEvent;

/**
 * A reader's position went back to a checkpoint it consumed, provisional again.
 */
final readonly class ReaderPositionRewound implements ProcessEvent, ReaderPositionEvent
{
    public function __construct(
        public string $positionId,
    ) {}
}

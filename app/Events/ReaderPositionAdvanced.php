<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Processes\ReaderPositionEvent;

/**
 * A reader's position moved on to a later checkpoint.
 */
final readonly class ReaderPositionAdvanced extends ProcessEvent implements ReaderPositionEvent
{
    public function __construct(
        public string $positionId,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Processes\PartRunEvent;

/**
 * A part of a run was lost.
 */
final readonly class PartRunLost extends ProcessEvent implements PartRunEvent
{
    public function __construct(
        public string $partId,
    ) {}
}

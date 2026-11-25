<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\PartRunEvent;

/**
 * A part of a run was lost.
 */
final readonly class PartRunLost implements PartRunEvent, ProcessEvent
{
    public function __construct(
        public string $partId,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\PartRunEvent;

/**
 * A part of a run was skipped after the result that controls it.
 */
final readonly class PartRunSkipped implements PartRunEvent, ProcessEvent
{
    public function __construct(
        public string $partId,
    ) {}
}

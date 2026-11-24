<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\PartRunEvent;

/**
 * A part of a run finished draining its output.
 */
final readonly class PartRunDrained extends ProcessEvent implements PartRunEvent
{
    public function __construct(
        public string $partId,
    ) {}
}

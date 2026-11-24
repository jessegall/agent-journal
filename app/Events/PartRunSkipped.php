<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Processes\PartRunEvent;

/**
 * A part of a run was skipped after the result that controls it.
 */
final readonly class PartRunSkipped extends ProcessEvent implements PartRunEvent
{
    public function __construct(
        public string $partId,
    ) {}
}

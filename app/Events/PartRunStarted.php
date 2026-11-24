<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Processes\PartRunEvent;

/**
 * A part of a run started on its host.
 */
final readonly class PartRunStarted extends ProcessEvent implements PartRunEvent
{
    public function __construct(
        public string $partId,
        public string $host,
    ) {}
}

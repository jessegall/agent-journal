<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\PartRunEvent;
use App\Enums\Runs\CaptureState;

/**
 * A part of a run's capture took the state given.
 */
final readonly class PartRunCaptureMarked extends ProcessEvent implements PartRunEvent
{
    public function __construct(
        public string $partId,
        public CaptureState $state,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\PartRunEvent;
use App\Processes\Enums\CaptureStatus;

/**
 * A part of a run's capture took the state given.
 */
final readonly class PartRunCaptureMarked implements PartRunEvent, ProcessEvent
{
    public function __construct(
        public string $partId,
        public CaptureStatus $status,
    ) {}
}

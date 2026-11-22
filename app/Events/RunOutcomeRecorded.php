<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Enums\RunLogicalResult;

/**
 * A run attempt's logical result was recorded, or a provisional one was corrected in place. It names the run, the
 * attempt and the result only.
 */
final readonly class RunOutcomeRecorded implements Event
{
    public function __construct(
        public string $runId,
        public string $attemptId,
        public RunLogicalResult $result,
        public bool $isCorrection,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Enums\Runs\RunLogicalResult;

/**
 * A run attempt's logical result was recorded, or a provisional one was corrected in place. It names the run, the
 * attempt and the result only.
 */
final readonly class RunOutcomeRecorded implements ProcessEvent
{
    public function __construct(
        public string $runId,
        public string $attemptId,
        public RunLogicalResult $result,
        public bool $isCorrection,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Runs\RunLogicalResult;
use App\Enums\Runs\RunResultSource;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\RunOutcome;
use App\Models\Runs\RunResultConflict;

/**
 * Records a run attempt's logical result once, under the attempt's own lock: the first authoritative result wins over
 * loss evidence that arrives with it or after it; a signed result corrects a provisional Unknown in place; and a
 * second authoritative result that disagrees is refused and kept as a conflict.
 */
final readonly class RunOutcomes
{
    public function record(ProcessRun $run, RunLogicalResult $result, RunResultSource $source): void
    {
        $locked = ProcessRun::lockedForOutcome($run->id);
        $attemptId = $locked->attempt_id;

        RunOutcome::lockedForAttempt($attemptId)
            ->map(fn (RunOutcome $kept) => $this->settle($kept, $result, $source))
            ->getOrCall(fn () => RunOutcome::create($locked, $attemptId, $result, $source));
    }

    private function settle(RunOutcome $kept, RunLogicalResult $result, RunResultSource $source): RunOutcome
    {
        if (! $source->isAuthoritative() || $kept->isResult($result)) {
            return $kept;
        }

        if ($kept->isProvisional()) {
            $kept->correct($result, $source);

            return $kept;
        }

        RunResultConflict::create($kept, $result);

        return $kept;
    }
}

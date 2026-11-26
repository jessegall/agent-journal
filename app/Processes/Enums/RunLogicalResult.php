<?php

declare(strict_types=1);

namespace App\Processes\Enums;

use App\Values\ExecutionPlan;

/**
 * How a run attempt ended as a whole: by its root plan's status, never by one part's exit.
 */
enum RunLogicalResult: string
{
    case Succeeded = 'succeeded';
    case Failed = 'failed';
    case Unknown = 'unknown';
    case Stopped = 'stopped';

    /**
     * The result the supervisor's root status means: zero succeeded, anything else failed. A recovered failing step
     * or an earlier pipeline member that failed with pipefail off leaves a root status of zero, so the run succeeded.
     */
    public static function ofRootStatus(int $status): self
    {
        if ($status === 0) {
            return self::Succeeded;
        }

        return self::Failed;
    }

    /**
     * What a reader is told of the attempt: a plan that only started a background child finished, never succeeded,
     * because the child's own result is not known.
     */
    public function summaryFor(ExecutionPlan $plan): string
    {
        return match ($this) {
            self::Succeeded => $plan->startsOnlyInBackground() ? 'Requested shell plan finished' : 'Run finished',
            self::Failed => 'Run failed',
            self::Unknown => 'Run outcome unknown',
            self::Stopped => 'Run stopped',
        };
    }
}

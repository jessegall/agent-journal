<?php

declare(strict_types=1);

namespace Domain\Helpers\Enums;

/**
 * Why a report's claim to answer a helper job was refused.
 */
enum ReportJobDiscrepancyReason: string
{
    // The session's start names a job that no longer exists.
    case JobMissing = 'job_missing';
    // The filer is not the helper the job was given to, or not the agent the start started.
    case FilerMismatch = 'filer_mismatch';
    // The report is already tied to another job.
    case ConflictingJob = 'conflicting_job';
}

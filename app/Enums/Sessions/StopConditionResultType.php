<?php

declare(strict_types=1);

namespace App\Enums\Sessions;

/**
 * How one stop condition ended on the host: passed, failed, ran out of time, could not start, was cancelled, ended
 * in a way the host could not tell, or was never run.
 */
enum StopConditionResultType: string
{
    case Passed = 'passed';
    case Failed = 'failed';
    case TimedOut = 'timed_out';
    case FailedToStart = 'failed_to_start';
    case Cancelled = 'cancelled';
    case Unknown = 'unknown';
    case NotRun = 'not_run';

    /**
     * Whether the condition proved the helper may not stop yet; an unknown, cancelled or skipped one proves nothing.
     */
    public function refusesStop(): bool
    {
        return match ($this) {
            self::Failed, self::TimedOut, self::FailedToStart => true,
            self::Passed, self::Cancelled, self::Unknown, self::NotRun => false,
        };
    }
}

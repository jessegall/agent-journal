<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Why a reader could not vouch for a check's output; the codes are stable.
 */
enum ProblemCode: string
{
    case OutputUnrecognized = 'output_unrecognized';
    case OutputMissing = 'output_missing';
    case OutputIncomplete = 'output_incomplete';
    case OutputAmbiguous = 'output_ambiguous';
    case OutputEncoding = 'output_encoding';
    case SummaryMissing = 'summary_missing';
    case SummaryConflict = 'summary_conflict';
    case CountsInvalid = 'counts_invalid';
    case ProgressTotalStale = 'progress_total_stale';
    case ReaderFailed = 'reader_failed';
    case RecordLimit = 'record_limit';
    case ReaderStale = 'reader_stale';
    case ExecutionError = 'execution_error';
    case ExitUnavailable = 'exit_unavailable';
    case OutcomeConflict = 'outcome_conflict';
    case NotNormalRun = 'not_normal_run';

    /**
     * Whether the reader itself broke on the output, rather than the output being wrong.
     */
    public function isReaderFailure(): bool
    {
        return $this === self::ReaderFailed || $this === self::RecordLimit;
    }

    /**
     * The next action a user or agent takes for this problem.
     */
    public function nextAction(): string
    {
        return match ($this) {
            self::OutputUnrecognized, self::OutputAmbiguous => 'revise the reader so every substantive record is accounted for',
            self::OutputMissing, self::OutputIncomplete => 'run the check again and keep its output whole',
            self::OutputEncoding => 'fix the encoding the check writes, or declare its output binary',
            self::SummaryMissing, self::SummaryConflict => 'make the check print one terminal summary',
            self::CountsInvalid, self::ProgressTotalStale => 'read the check output by hand; its counts do not add up',
            self::ReaderFailed, self::RecordLimit => 'revise the reader within its limits and prove it again',
            self::ReaderStale => 'propose a reader for the check as it is now',
            self::ExecutionError, self::ExitUnavailable => 'read the diagnostics; the check itself did not run to an end',
            self::OutcomeConflict => 'read the output by hand; its exit and its summary disagree',
            self::NotNormalRun => 'run the check normally; an evidence sample never gives a result',
        };
    }
}

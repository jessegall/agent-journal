<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Why a reader could not vouch for a check's output (doc 21 revision 6, section 72); the codes are stable.
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

    /**
     * The next action a person or agent takes for this problem.
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
        };
    }
}

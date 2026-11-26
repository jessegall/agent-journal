<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A brief passage a search pointed at that is no longer there: the brief changed since, or the passage id is not
 * one the search issued. It answers like a record that is unavailable, with no fallback to the summary.
 */
final class TaskPassageUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function make(): self
    {
        return new self('That passage of the task is no longer available; search again.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}

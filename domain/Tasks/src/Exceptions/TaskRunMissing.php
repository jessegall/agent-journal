<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * A task has no run of that number.
 */
final class TaskRunMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    /**
     * @use ThrowsLater<TaskRunMissing>
     */
    use ThrowsLater;

    public static function forRun(int $taskNumber, int $runNumber): self
    {
        return new self("Task {$taskNumber} has no run {$runNumber}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}

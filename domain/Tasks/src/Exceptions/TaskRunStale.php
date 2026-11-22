<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A resume of a run that is no longer the task's current started run, such as one left behind by a block and a restart.
 */
final class TaskRunStale extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forRun(int $taskNumber, int $runNumber): self
    {
        return new self(
            "Run {$runNumber} of task {$taskNumber} is not the task's current started run: resume that one.",
        );
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}

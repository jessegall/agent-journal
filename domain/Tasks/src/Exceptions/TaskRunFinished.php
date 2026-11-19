<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A change to a run that already finished.
 */
final class TaskRunFinished extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forRun(string $runId): self
    {
        return new self("Run {$runId} has finished.");
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

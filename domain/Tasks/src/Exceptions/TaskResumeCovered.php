<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A resume of a task while another task is the current work on the agent's stack.
 */
final class TaskResumeCovered extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function by(int $currentNumber, int $resumedNumber): self
    {
        return new self("Task {$currentNumber} is current. Finish or block it before resuming task {$resumedNumber}.");
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

<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use Domain\Tasks\Enums\TaskState;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A change of a task asked against what the caller read, refused because the task is no longer that way: its state,
 * revision or latest run moved on. The message names the task as it is now, so the caller reads it again.
 */
final class TaskChangedSinceRead extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function now(int $number, TaskState $state, int $runNumber): self
    {
        $run = $runNumber === 0 ? 'no run yet' : "run {$runNumber}";

        return new self("Task {$number} changed since you read it: it is now {$state->value}, {$run}.");
    }

    public static function notCancellable(int $number, TaskState $state): self
    {
        return new self("Task {$number} is {$state->value}, so it cannot be cancelled.");
    }

    public static function notBlockable(int $number, TaskState $state): self
    {
        return new self("Task {$number} is {$state->value}; only a started run can be blocked.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}

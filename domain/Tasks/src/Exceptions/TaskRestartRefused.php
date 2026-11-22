<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A start of a task that already ended: finished and cancelled tasks are not started again.
 */
final class TaskRestartRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forTask(int $number, string $state): self
    {
        return new self("Task {$number} is {$state}; an ended task is not started again.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}

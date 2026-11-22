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
 * A task picked to be given out automatically that is no longer open by the time it is claimed.
 */
final class TaskNotOpenForAssignment extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forTask(int $number, string $state): self
    {
        return new self("Task {$number} is {$state}; only an open task is given out automatically.");
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

<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A task run another session owns, which a start may not take.
 */
final class TaskRunTaken extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forTask(int $taskNumber): self
    {
        return new self(
            "Task {$taskNumber} is being worked on by another session; it cannot be started until that run ends.",
        );
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

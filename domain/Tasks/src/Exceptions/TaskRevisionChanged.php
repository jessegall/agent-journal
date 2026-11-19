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
 * An edit made against a revision of the task that is no longer its latest; the newer text stays.
 */
final class TaskRevisionChanged extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(int $taskNumber, int $expected, int $current): self
    {
        return new self(
            sprintf(
                'Task %s is at revision %s, not %s; read it again with tasks_read and edit that revision.',
                $taskNumber,
                $current,
                $expected,
            ),
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

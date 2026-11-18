<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class TaskMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forId(string $taskId): self
    {
        return new self("Task {$taskId} does not exist.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}

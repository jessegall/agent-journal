<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
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

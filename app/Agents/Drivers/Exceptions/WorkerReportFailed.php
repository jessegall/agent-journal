<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Exceptions;

use RuntimeException;
use Throwable;

final class WorkerReportFailed extends RuntimeException
{
    public static function forProcess(string $processId, Throwable $cause): self
    {
        return new self("The driver worker for {$processId} exhausted its report retries.", previous: $cause);
    }
}

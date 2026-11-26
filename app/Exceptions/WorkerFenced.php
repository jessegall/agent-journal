<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A worker whose process another worker took over makes no more orders, and exits.
 */
final class WorkerFenced extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forProcess(string $processId, int $generation, int $current): self
    {
        return new self("Worker {$generation} of process {$processId} was replaced by worker {$current}.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}

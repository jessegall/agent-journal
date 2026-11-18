<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * Output is removed only from runs that have ended; a run still going keeps all of it.
 */
final class CleanRefused extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function notEnded(string $runId): self
    {
        return new self("Run {$runId} has not ended; its output is removed only once it has.");
    }

    protected function status(): int
    {
        return 409;
    }
}

<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A run that is not lost cannot be retried or have its leftover processes stopped.
 */
final class RetryRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function notLost(string $runId): self
    {
        return new self("Run {$runId} is not lost; only a lost run is retried or has its leftover processes stopped.");
    }

    public static function otherLine(string $runId): self
    {
        return new self("The line is not the one run {$runId} ran; a retry admits the same line again.");
    }

    public static function ofAnotherActor(string $runId): self
    {
        return new self("Only a user, or the actor who ran it, may retry run {$runId}.");
    }

    public static function refused(string $code, string $reason): self
    {
        return new self("The retry was refused by admission ({$code}): {$reason} Nothing in this request started.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}

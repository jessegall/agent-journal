<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A lost run cannot be retried or its survivors stopped this way.
 */
final class RetryRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function notLost(string $runId): self
    {
        return new self("Run {$runId} is not lost; only a lost run is retried or has its survivors stopped.");
    }

    public static function otherLine(string $runId): self
    {
        return new self("The line is not the one run {$runId} ran; a retry admits the same line again.");
    }

    public static function notYours(string $runId): self
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

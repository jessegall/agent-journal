<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A part's retained output cannot be replayed into a new assessment: nothing was run again.
 */
final class ReplayRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function evidenceRun(string $partRunId): self
    {
        return new self("Part {$partRunId} belongs to an evidence sample: it replays only as proof material.");
    }

    public static function notEnded(string $partRunId): self
    {
        return new self("Part {$partRunId} has not ended, so its output is not whole yet.");
    }

    public static function noPair(string $operation): self
    {
        return new self("{$operation} has no approved proven reader to replay with.");
    }

    public static function contractChanged(string $partRunId): self
    {
        return new self("The contract of part {$partRunId}'s operation changed since it ran; run it again instead.");
    }

    public static function notYours(string $partRunId): self
    {
        return new self("Only a user, or the actor who ran part {$partRunId}, may replay it.");
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

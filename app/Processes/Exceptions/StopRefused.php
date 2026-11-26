<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A run may be stopped only by a user or the actor who runs it, and only while it has not ended.
 */
final class StopRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function ofAnotherActor(string $runId): self
    {
        return new self("Only a user, or the actor who runs it, may stop run {$runId}.");
    }

    public static function ended(string $runId): self
    {
        return new self("Run {$runId} has already ended.");
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

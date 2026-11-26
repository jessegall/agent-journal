<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A process run that was not opened by the actor who names it as their own: another actor opened it, or no run of
 * this project has that id.
 */
final class ProcessRunOfAnotherActor extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forRun(string $runId): self
    {
        return new self("Process run {$runId} was not opened by you.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}

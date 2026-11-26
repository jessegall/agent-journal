<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * Only the actor a run belongs to may take back the outcome entitlement its request gave.
 */
final class RunOutcomeAccessRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function ofAnotherActor(string $runId): self
    {
        return new self("Only the actor run {$runId} belongs to may take back who hears of its outcome.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}

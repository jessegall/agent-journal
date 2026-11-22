<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * Only the actor a run belongs to may take back the outcome entitlement its request gave.
 */
final class RunOutcomeAccessRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function notYours(string $runId): self
    {
        return new self("Only the actor run {$runId} belongs to may take back who hears of its outcome.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}

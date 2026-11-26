<?php

declare(strict_types=1);

namespace App\Accounts\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A cost arrived under a source the account already holds a cost of, with another amount or time: one result has one
 * cost, so the second is refused and the first is kept.
 */
final class UsageCostConflict extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $sourceId): self
    {
        return new self("A different cost was already kept for source {$sourceId}.");
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

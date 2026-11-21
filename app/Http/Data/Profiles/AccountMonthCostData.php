<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Http\Data\Support\OptionalOrMissing;
use App\Profiles\Values\MonthCost;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The estimated US dollars the journal observed an account cost in the current UTC month, as an exact decimal, how
 * many results that is, when the month began and when the latest of them was observed.
 */
#[TypeScript]
final class AccountMonthCostData extends Data
{
    use OptionalOrMissing;

    public function __construct(
        public readonly string $usd,
        public readonly int $observations,
        public readonly string $monthStart,
        public readonly string $lastObservedAt,
    ) {}

    public static function fromCost(MonthCost $cost): self
    {
        return new self(
            $cost->usd->amount,
            $cost->observations,
            $cost->monthStart->toIso8601String(),
            $cost->lastObservedAt->toIso8601String(),
        );
    }
}

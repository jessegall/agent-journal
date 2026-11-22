<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Http\Data\Support\OptionalOrMissing;
use App\Profiles\Models\AccountUsageTokens;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The newest thread token count of an account's current sign-in: the thread's total, the parts of it the driver
 * reported, the last turn's total, and when it was observed.
 */
#[TypeScript]
final class AccountThreadTokensData extends Data
{
    use OptionalOrMissing;

    public function __construct(
        public readonly int $total,
        public readonly int|null $input,
        public readonly int|null $cachedInput,
        public readonly int|null $output,
        public readonly int|null $reasoningOutput,
        public readonly int|null $lastTurnTotal,
        public readonly string $observedAt,
    ) {}

    public static function fromSnapshot(AccountUsageTokens $snapshot): self
    {
        return new self(
            $snapshot->total,
            $snapshot->input,
            $snapshot->cached_input,
            $snapshot->output,
            $snapshot->reasoning_output,
            $snapshot->last_turn_total,
            $snapshot->observed_at->toIso8601String(),
        );
    }
}

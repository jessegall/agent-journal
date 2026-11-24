<?php

declare(strict_types=1);

namespace App\Data\Accounts;

use App\Enums\UsageWindowSlot;
use App\Models\Accounts\AccountUsageWindow;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One limit window of an account as its driver last reported it: the limit, the window, its used percent, its length
 * in minutes and when it resets, each only when reported, and when it was observed.
 */
#[TypeScript]
final class AccountUsageWindowData extends Data
{
    public function __construct(
        public readonly string $limitId,
        public readonly UsageWindowSlot $slot,
        public readonly float|null $usedPercent,
        public readonly int|null $windowMinutes,
        public readonly string|null $resetsAt,
        public readonly string $observedAt,
    ) {}

    public static function fromWindow(AccountUsageWindow $window): self
    {
        return new self(
            $window->limit_id,
            $window->slot,
            $window->used_percent,
            $window->duration_minutes,
            $window->resets_at?->toIso8601String(),
            $window->observed_at->toIso8601String(),
        );
    }
}

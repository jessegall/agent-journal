<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Agents\Enums\StartUnavailableReason;
use App\Profiles\Models\Account;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An account the owner may choose for a start of one driver, with no sign-in detail: its label, whether it can start
 * now and why not, the sign-in revision the owner reviews and whether new starts use it by default.
 */
#[TypeScript]
final class EligibleAccountData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $label,
        public readonly StartUnavailableReason|null $unavailableReason,
        public readonly string|null $unavailableSentence,
        public readonly string|null $expiresAt,
        public readonly int $signInRevision,
        public readonly bool $isDefault,
    ) {}

    public static function fromAccount(Account $account, bool $isDefault): self
    {
        return new self(
            $account->id,
            $account->label,
            $account->startUnavailableReason(),
            $account->startUnavailableReason()?->sentence(),
            $account->expires_at?->toIso8601String(),
            $account->sign_in_generation,
            $isDefault,
        );
    }
}

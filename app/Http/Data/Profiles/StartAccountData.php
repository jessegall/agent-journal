<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Agents\Enums\AccountProcessRole;
use App\Agents\Values\AccountUse;
use App\Profiles\Enums\AccountState;
use App\Profiles\Models\Account;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The account one start ran with, as the owner sees it later: its label as it is now, kept after removal, its state,
 * and when the start started and ended. No folder or other private reference is shown.
 */
#[TypeScript]
final class StartAccountData extends Data
{
    public function __construct(
        public readonly string $sessionId,
        public readonly string $program,
        public readonly string $accountId,
        public readonly string $accountLabel,
        public readonly AccountState $accountState,
        public readonly AccountProcessRole $role,
        public readonly string $startedAt,
        public readonly string|null $endedAt,
    ) {}

    public static function fromUse(AccountUse $use, Account $account): self
    {
        return new self(
            $use->sessionId,
            $use->program,
            $account->id,
            $account->label,
            $account->state,
            $use->role,
            $use->startedAt->toIso8601String(),
            $use->endedAt?->toIso8601String(),
        );
    }
}

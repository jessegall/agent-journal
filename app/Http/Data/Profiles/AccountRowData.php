<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Agents\Values\AccountUse;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\CleanupProblem;
use App\Profiles\Models\Account;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One saved account as its owner sees it: its name, driver, how it signs in, its state, the identity and workspace its
 * driver reported, whether new starts use it, how many starts run on it, when it was last checked and the usage its
 * drivers reported. Never its folder or a credential.
 */
#[TypeScript]
final class AccountRowData extends Data
{
    /**
     * @param  list<AccountStartData>  $recentStarts
     */
    public function __construct(
        public readonly string $id,
        public readonly string $driver,
        public readonly string $label,
        public readonly int $nameRevision,
        public readonly SignInMethodData $signIn,
        public readonly AccountState $state,
        public readonly string|null $identity,
        public readonly string|null $workspace,
        public readonly bool $isActive,
        public readonly int $runningCount,
        public readonly string|null $checkedAt,
        public readonly string|null $expiresAt,
        public readonly CleanupProblem|null $cleanupProblem,
        public readonly bool $awaitsCleanupRetry,
        public readonly bool $isHeldForCheck,
        public readonly bool $isCheckInconclusive,
        #[DataCollectionOf(AccountStartData::class)]
        public readonly array $recentStarts,
        public readonly AccountUsageData|Optional $usage,
    ) {}

    /**
     * @param  list<AccountUse>  $recentUses
     */
    public static function fromAccount(
        Account $account,
        bool $isActive,
        int $runningCount,
        array $recentUses,
        AccountUsageData|Optional $usage,
    ): self {
        return new self(
            $account->id,
            $account->account_protocol,
            $account->label,
            $account->name_revision,
            SignInMethodData::fromMethod($account->account_protocol, $account->method),
            $account->state,
            $account->identity,
            $account->workspace,
            $isActive,
            $runningCount,
            $account->checked_at?->toIso8601String(),
            $account->expires_at?->toIso8601String(),
            $account->cleanup_problem,
            $account->awaitsCleanupRetry(),
            $account->isHeldForCheck(),
            $account->isCheckInconclusive(),
            array_map(AccountStartData::fromUse(...), $recentUses),
            $usage,
        );
    }
}

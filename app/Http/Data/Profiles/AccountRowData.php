<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Agents\Support\AccountUse;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\CleanupProblem;
use App\Profiles\Models\Account;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One saved account as its owner sees it: its name, program, state, the identity its program reported, whether new
 * launches use it, how many launches run on it and when it was last checked. Never its folder or a credential.
 */
#[TypeScript]
final class AccountRowData extends Data
{
    /**
     * @param  list<AccountLaunchData>  $recentLaunches
     */
    public function __construct(
        public readonly string $id,
        public readonly string $program,
        public readonly string $label,
        public readonly AccountState $state,
        public readonly string|null $identity,
        public readonly bool $isActive,
        public readonly int $runningCount,
        public readonly string|null $checkedAt,
        public readonly CleanupProblem|null $cleanupProblem,
        public readonly bool $awaitsCleanupRetry,
        #[DataCollectionOf(AccountLaunchData::class)]
        public readonly array $recentLaunches,
    ) {}

    /**
     * @param  list<AccountUse>  $recentUses
     */
    public static function fromAccount(Account $account, bool $isActive, int $runningCount, array $recentUses): self
    {
        return new self(
            $account->id,
            $account->program,
            $account->label,
            $account->state,
            $account->identity,
            $isActive,
            $runningCount,
            $account->checked_at?->toIso8601String(),
            $account->cleanup_problem,
            $account->awaitsCleanupRetry(),
            array_map(AccountLaunchData::fromUse(...), $recentUses),
        );
    }
}

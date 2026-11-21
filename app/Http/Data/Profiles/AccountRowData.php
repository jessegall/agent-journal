<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Agents\Values\AccountUse;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\CleanupProblem;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Models\Account;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One saved account as its owner sees it: its name, program, state, the identity its program reported, whether new
 * starts use it, how many starts run on it and when it was last checked. Never its folder or a credential.
 */
#[TypeScript]
final class AccountRowData extends Data
{
    /**
     * @param  list<AccountStartData>  $recentStarts
     */
    public function __construct(
        public readonly string $id,
        public readonly string $program,
        public readonly string $label,
        public readonly SignInMethod $method,
        public readonly AccountState $state,
        public readonly string|null $identity,
        public readonly bool $isActive,
        public readonly int $runningCount,
        public readonly string|null $checkedAt,
        public readonly string|null $expiresAt,
        public readonly CleanupProblem|null $cleanupProblem,
        public readonly bool $awaitsCleanupRetry,
        #[DataCollectionOf(AccountStartData::class)]
        public readonly array $recentStarts,
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
            $account->method,
            $account->state,
            $account->identity,
            $isActive,
            $runningCount,
            $account->checked_at?->toIso8601String(),
            $account->expires_at?->toIso8601String(),
            $account->cleanup_problem,
            $account->awaitsCleanupRetry(),
            array_map(AccountStartData::fromUse(...), $recentUses),
        );
    }
}

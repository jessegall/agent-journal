<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Accounts\Enums\AccountStatus;
use App\Accounts\Enums\CleanupProblem;
use App\Web\Creation\Buildable;
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
    /** @use Buildable<AccountRowDataFields> */
    use Buildable;

    protected const string FIELDS = AccountRowDataFields::class;

    /**
     * @param  list<AccountStartData>  $recentStarts
     */
    public function __construct(
        public readonly string $id,
        public readonly string $driver,
        public readonly string $label,
        public readonly int $nameRevision,
        public readonly SignInMethodData $signIn,
        public readonly AccountStatus $status,
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
}

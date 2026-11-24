<?php

declare(strict_types=1);

namespace App\Data\Accounts;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The owner's saved accounts, by driver and name, each driver's current choice, and the recent sign-ins.
 */
#[TypeScript]
final class AccountListData extends Data
{
    /**
     * @param  list<AccountRowData>  $rows
     * @param  list<AccountSelectionData>  $selections
     * @param  list<SignInAttemptData>  $attempts
     * @param  list<PendingAttemptCleanupData>  $pendingCleanups
     * @param  list<DriverMethodsData>  $methods
     */
    public function __construct(
        #[DataCollectionOf(AccountRowData::class)]
        public readonly array $rows,
        #[DataCollectionOf(AccountSelectionData::class)]
        public readonly array $selections,
        #[DataCollectionOf(SignInAttemptData::class)]
        public readonly array $attempts,
        #[DataCollectionOf(PendingAttemptCleanupData::class)]
        public readonly array $pendingCleanups,
        #[DataCollectionOf(DriverMethodsData::class)]
        public readonly array $methods,
    ) {}
}

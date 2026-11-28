<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The usage an account's drivers reported: its limit windows in the current sign-in, the cost observed this UTC
 * month and the newest thread token count, each only when one was reported.
 */
#[TypeScript]
final class AccountUsageData extends Data
{
    /** @use \App\Web\Creation\Buildable<AccountUsageDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = AccountUsageDataFields::class;

    /**
     * @param  list<AccountUsageWindowData>  $windows
     */
    public function __construct(
        #[DataCollectionOf(AccountUsageWindowData::class)]
        public readonly array $windows,
        public readonly AccountMonthCostData|Optional $monthCost,
        public readonly AccountThreadTokensData|Optional $latestThread,
    ) {}
}

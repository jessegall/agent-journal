<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Accounts\Values\MonthCost;
use App\Models\Accounts\AccountUsageTokens;
use App\Models\Accounts\AccountUsageWindow;
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
    /**
     * @param  list<AccountUsageWindowData>  $windows
     */
    public function __construct(
        #[DataCollectionOf(AccountUsageWindowData::class)]
        public readonly array $windows,
        public readonly AccountMonthCostData|Optional $monthCost,
        public readonly AccountThreadTokensData|Optional $latestThread,
    ) {}

    /**
     * The account's usage; left out when it has no reading at all, so the account shows no usage.
     *
     * @param  list<AccountUsageWindow>  $windows
     */
    public static function fromReadings(
        array $windows,
        MonthCost|null $cost,
        AccountUsageTokens|null $thread,
    ): self|Optional {
        if ($windows === [] && $cost === null && $thread === null) {
            return Optional::create();
        }

        return new self(
            array_map(AccountUsageWindowData::fromWindow(...), $windows),
            AccountMonthCostData::optionalOrMissing($cost),
            AccountThreadTokensData::optionalOrMissing($thread),
        );
    }
}

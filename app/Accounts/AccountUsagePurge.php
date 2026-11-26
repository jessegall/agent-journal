<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Models\Accounts\AccountUsageCost;
use App\Models\Accounts\AccountUsageTokens;
use App\Models\Accounts\AccountUsageWindow;
use Illuminate\Database\Eloquent\Collection;

/**
 * Deletes every usage reading of an account whose removal finished, so a late report cannot bring one back.
 */
final readonly class AccountUsagePurge
{
    private const int CHUNK_SIZE = 200;

    public function forgetAccount(string $accountId): void
    {
        foreach ([
            AccountUsageWindow::class,
            AccountUsageCost::class,
            AccountUsageTokens::class,
        ] as $model) {
            $model::ofAccount($accountId)->readInChunks(self::CHUNK_SIZE, function (Collection $rows): void {
                foreach ($rows as $row) {
                    $row->forget();
                }
            });
        }
    }
}

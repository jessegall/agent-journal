<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Accounts\Enums\AccountNoticeReason;
use App\Models\Accounts\AccountNotice;
use App\Models\Accounts\ActiveAccount;
use Carbon\CarbonImmutable;

/**
 * Records and resolves a driver's account notices under the driver's selection lock, so two records of the same
 * notice count one row twice and a resolve never races a record; each notice changes only its own row.
 */
final readonly class AccountNotices
{
    /**
     * Records that it happened: an open notice of the same driver and reason counts once more instead of repeating.
     */
    public function record(string $driver, AccountNoticeReason $reason): AccountNotice
    {
        ActiveAccount::findLockedForJournal($driver);
        $open = AccountNotice::findLockedOpenFor($driver, $reason);

        if ($open === null) {
            return AccountNotice::create($driver, $reason);
        }

        $open->countAgain();

        return $open;
    }

    /**
     * Resolves the driver's open notices once its accounts work again, in the order of their ids.
     */
    public function resolveOpen(string $driver, CarbonImmutable $now): void
    {
        ActiveAccount::findLockedForJournal($driver);

        foreach (AccountNotice::findLockedOpenOf($driver) as $notice) {
            $notice->resolveAt($now);
        }
    }
}

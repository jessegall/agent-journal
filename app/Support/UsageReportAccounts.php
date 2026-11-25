<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\AccountMissing;
use App\Exceptions\SessionProcessUnknown;
use App\Exceptions\UsageReportRefused;
use App\Models\Accounts\Account;
use App\Models\Sessions\SessionProcess;
use App\Values\ReportedStart;

/**
 * Finds the saved account a host's usage report belongs to through the start the host claimed, never through
 * anything the report names: another host's start is as unknown as a missing one, and a removed account takes none.
 */
final readonly class UsageReportAccounts
{
    /**
     * The start's saved account, locked.
     *
     * @throws SessionProcessUnknown
     * @throws UsageReportRefused when the report names another sign-in generation than the start ran in
     * @throws AccountMissing when the account is removed or being removed
     */
    public function accountOf(ReportedStart $reported): Account
    {
        $start = SessionProcess::findClaimedBy($reported->hostId, $reported->key);

        if ($start->account_type !== Account::linkType() || $start->account_generation !== $reported->generation) {
            throw UsageReportRefused::otherGeneration($reported->key);
        }

        $account = Account::findLockedForJournal($start->account_id);

        if ($account->isBeingRemoved()) {
            throw AccountMissing::for($account->id);
        }

        return $account;
    }
}

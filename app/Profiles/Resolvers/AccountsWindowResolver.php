<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Agents\Contracts\AccountUses;
use App\Http\Data\Profiles\AccountListData;
use App\Http\Data\Profiles\AccountRowData;
use App\Http\Data\Profiles\AccountSelectionData;
use App\Http\Data\Profiles\PendingAttemptCleanupData;
use App\Http\Data\Profiles\SignInAttemptData;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Ui\Contracts\PageResolver;
use Carbon\CarbonImmutable;

/**
 * The Accounts page: every saved account that is not removed, with whether new starts use it and how many starts
 * run on it as Core counts them, and each program's current choice.
 */
final readonly class AccountsWindowResolver implements PageResolver
{
    private const int RECENT_STARTS = 5;

    public function __construct(private AccountUses $uses) {}

    public function read(): AccountListData
    {
        $accounts = Account::listed();
        $selections = ActiveAccount::listed();
        $chosen = array_map(fn (ActiveAccount $selection) => $selection->account_id, $selections);
        $counts = $this->uses->counts(array_map(fn (Account $account) => $account->recordIdentity(), $accounts));

        return AccountListData::from([
            'rows' => array_map(fn (Account $account) => AccountRowData::fromAccount(
                $account,
                in_array($account->id, $chosen, true),
                $counts->runningFor($account->recordIdentity()),
                $this->uses->history($account->recordIdentity(), self::RECENT_STARTS),
            ), $accounts),
            'selections' => array_map(AccountSelectionData::fromSelection(...), $selections),
            'attempts' => array_map(SignInAttemptData::fromAttempt(...), SignInAttempt::recentFor(CarbonImmutable::now())),
            'pendingCleanups' => array_map(PendingAttemptCleanupData::fromAttempt(...), SignInAttempt::pendingCleanups()),
        ]);
    }
}

<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Agents\Contracts\AccountUses;
use App\Http\Data\Profiles\AccountListData;
use App\Http\Data\Profiles\AccountRowData;
use App\Http\Data\Profiles\AccountSelectionData;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Ui\Contracts\PageResolver;

/**
 * The Accounts page: every saved account that is not removed, with whether new launches use it and how many launches
 * run on it as Core counts them, and each program's current choice.
 */
final readonly class AccountsWindowResolver implements PageResolver
{
    public function __construct(private AccountUses $uses) {}

    public function read(): AccountListData
    {
        $accounts = Account::listed();
        $selections = ActiveAccount::listed();
        $chosen = array_map(fn (ActiveAccount $selection) => $selection->account_id, $selections);
        $counts = $this->uses->counts(array_map(fn (Account $account) => $account->recordIdentity(), $accounts));

        return new AccountListData(
            array_map(fn (Account $account) => AccountRowData::fromAccount(
                $account,
                in_array($account->id, $chosen, true),
                $counts->runningFor($account->recordIdentity()),
            ), $accounts),
            array_map(AccountSelectionData::fromSelection(...), $selections),
        );
    }
}

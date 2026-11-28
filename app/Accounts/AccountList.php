<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Accounts\Contracts\AccountUses;
use App\Accounts\Data\AccountListData;
use App\Accounts\Data\AccountListPageData;
use App\Accounts\Data\AccountRowData;
use App\Accounts\Data\AccountSelectionData;
use App\Accounts\Data\AccountUsageData;
use App\Accounts\Data\DriverMethodsData;
use App\Accounts\Data\PendingAttemptCleanupData;
use App\Accounts\Data\SignInAttemptData;
use App\Agents\Drivers\DefaultDrivers;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountUsageCost;
use App\Models\Accounts\AccountUsageTokens;
use App\Models\Accounts\AccountUsageWindow;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;

final readonly class AccountList
{
    private const int RECENT_START_LIMIT = 5;

    public function __construct(private AccountUses $uses, private SignInProtocols $protocols) {}

    public function page(int $page, int $size, string $chosen, int $usagePage, bool $adding): AccountListPageData
    {
        $listed = Account::pageListed($page, $size);
        $accounts = array_values($listed->items());
        $selected = $adding ? null : $this->selected($accounts, $chosen);
        $visible = $accounts;

        if ($selected !== null && ! in_array($selected->id, array_column($visible, 'id'), true)) {
            $visible[] = $selected;
        }

        $families = $adding
            ? DefaultDrivers::familyKeys()
            : array_values(array_unique(array_column($visible, 'account_protocol')));

        $selections = ActiveAccount::forListedFamilies($families);
        $identities = array_map(static fn (Account $account): RecordIdentity => $account->record_identity, $visible);
        $counts = $this->uses->counts($identities);
        $histories = $this->uses->histories($identities, self::RECENT_START_LIMIT);
        $now = CarbonImmutable::now();
        $windows = AccountUsageWindow::findCurrentOf($visible);
        $costs = AccountUsageCost::resolveMonthTotals(array_column($visible, 'id'), $now);
        $threads = AccountUsageTokens::findNewestOf($visible);

        $row = function (Account $account, array $readings) use ($selections, $counts, $histories, $costs, $threads) {
            $identity = $account->record_identity;
            $active = $selections[$account->account_protocol] ?? null;

            return AccountRowData::build()
                ->account($account, $this->protocols)
                ->isActive($active?->account_id === $account->id)
                ->runningCount($counts->runningFor($identity))
                ->recentStarts(array_map(Data\AccountStartData::fromUse(...), $histories->forAccount($identity)))
                ->usage(AccountUsageData::build()->readings(
                    $readings,
                    $costs[$account->id] ?? null,
                    $threads[$account->id] ?? null,
                )->finish())
                ->finish();
        };

        $rows = array_map(static fn (Account $account) => $row($account, $windows[$account->id] ?? []), $accounts);

        $fields = AccountListPageData::build()
            ->rows($rows)
            ->total($listed->total())
            ->page($listed->currentPage())
            ->lastPage($listed->lastPage());

        if ($selected !== null) {
            $usage = AccountUsageWindow::pageOf($selected, $usagePage);

            $fields->selected($row($selected, array_values($usage->items())))
                ->usagePage($usage->currentPage())
                ->usageLastPage($usage->lastPage());
        }

        if ($adding) {
            $fields->addForm($this->addForm($rows, array_values($selections), $now));
        }

        return $fields->finish();
    }

    /** @param list<Account> $accounts */
    private function selected(array $accounts, string $chosen): Account|null
    {
        if ($chosen === '') {
            return null;
        }

        return array_find($accounts, static fn (Account $account) => $account->id === $chosen)
            ?? Account::findKept($chosen);
    }

    /**
     * @param  list<AccountRowData>  $rows
     * @param  list<ActiveAccount>  $selections
     */
    private function addForm(array $rows, array $selections, CarbonImmutable $now): AccountListData
    {
        return AccountListData::build()
            ->rows($rows)
            ->selections(array_map(AccountSelectionData::fromSelection(...), $selections))
            ->attempts(array_map(SignInAttemptData::fromAttempt(...), SignInAttempt::findRecentFor($now)))
            ->pendingCleanups(array_map(PendingAttemptCleanupData::fromAttempt(...), SignInAttempt::findPendingCleanups()))
            ->methods(array_map(
                fn (string $driver) => DriverMethodsData::build()->driver($driver)->protocols($this->protocols)->finish(),
                DefaultDrivers::familyKeys(),
            ))
            ->finish();
    }
}

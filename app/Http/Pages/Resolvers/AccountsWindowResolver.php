<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Contracts\Accounts\AccountUses;
use App\Contracts\Navigation\PageResolver;
use App\Data\Accounts\AccountListData;
use App\Data\Accounts\AccountRowData;
use App\Data\Accounts\AccountUsageData;
use App\Data\Accounts\DriverMethodsData;
use App\Http\Pages\Accounts\AccountsIndex;
use App\Http\Requests\Profiles\AccountsPageRequest;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountUsageCost;
use App\Models\Accounts\AccountUsageTokens;
use App\Models\Accounts\AccountUsageWindow;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Support\DefaultDrivers;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\SignInProtocols;
use Carbon\CarbonImmutable;

/**
 * The Accounts page: every saved account that is not removed, with whether new starts use it, how many starts run on
 * it as Core counts them and the usage its drivers reported, read for all rows at once, and each driver's choice.
 */
final readonly class AccountsWindowResolver implements PageResolver
{
    private const int RECENT_STARTS = 5;

    public function __construct(
        private AccountUses $uses,
        private SignInProtocols $protocols,
        private AccountsPageRequest $request,
        private AccountsIndex $layout,
    ) {}

    public function read(): DeclaredLayoutData
    {
        return $this->layout->of($this->list(), $this->request->chosenAccount(), $this->request->isAdding());
    }

    /**
     * The saved accounts with their use and usage, the sign-in attempts and cleanups, and each driver's methods.
     */
    public function list(): AccountListData
    {
        return $this->listOf(Account::listed(), ActiveAccount::listed());
    }

    /**
     * @param  list<Account>  $accounts
     * @param  list<ActiveAccount>  $selections
     */
    private function listOf(array $accounts, array $selections): AccountListData
    {
        $chosen = array_map(fn (ActiveAccount $selection) => $selection->account_id, $selections);
        $counts = $this->uses->counts(array_map(fn (Account $account) => $account->record_identity, $accounts));
        $now = CarbonImmutable::now();
        $windows = AccountUsageWindow::currentOf($accounts);
        $costs = AccountUsageCost::monthTotals(array_map(fn (Account $account) => $account->id, $accounts), $now);
        $threads = AccountUsageTokens::newestOf($accounts);

        return AccountListData::from([
            'rows' => array_map(fn (Account $account) => AccountRowData::fromAccount(
                $this->protocols,
                $account,
                in_array($account->id, $chosen, true),
                $counts->runningFor($account->record_identity),
                $this->uses->history($account->record_identity, self::RECENT_STARTS),
                AccountUsageData::fromReadings(
                    $windows[$account->id] ?? [],
                    $costs[$account->id] ?? null,
                    $threads[$account->id] ?? null,
                ),
            ), $accounts),
            'selections' => $selections,
            'attempts' => SignInAttempt::recentFor($now),
            'pendingCleanups' => SignInAttempt::pendingCleanups(),
            'methods' => array_map(
                fn (string $driver) => DriverMethodsData::fromProtocols($driver, $this->protocols),
                DefaultDrivers::familyKeys(),
            ),
        ]);
    }
}

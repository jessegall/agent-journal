<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Agents\Contracts\AccountUses;
use App\Drivers\Support\DefaultDrivers;
use App\Http\Data\Profiles\AccountListData;
use App\Http\Data\Profiles\AccountRowData;
use App\Http\Data\Profiles\AccountUsageData;
use App\Http\Data\Profiles\DriverMethodsData;
use App\Http\Requests\Profiles\AccountsPageRequest;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountUsageCost;
use App\Profiles\Models\AccountUsageTokens;
use App\Profiles\Models\AccountUsageWindow;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\AccountsLayout;
use App\Profiles\Support\SignInProtocols;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
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
        private AccountsLayout $layout,
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
        $counts = $this->uses->counts(array_map(fn (Account $account) => $account->recordIdentity(), $accounts));
        $now = CarbonImmutable::now();
        $windows = AccountUsageWindow::currentOf($accounts);
        $costs = AccountUsageCost::monthTotals(array_map(fn (Account $account) => $account->id, $accounts), $now);
        $threads = AccountUsageTokens::newestOf($accounts);

        return AccountListData::from([
            'rows' => array_map(fn (Account $account) => AccountRowData::fromAccount(
                $account,
                in_array($account->id, $chosen, true),
                $counts->runningFor($account->recordIdentity()),
                $this->uses->history($account->recordIdentity(), self::RECENT_STARTS),
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
                fn (string $driver) => DriverMethodsData::fromMethods(
                    $driver,
                    $this->protocols->methodsOf($driver),
                ),
                DefaultDrivers::familyKeys(),
            ),
        ]);
    }
}

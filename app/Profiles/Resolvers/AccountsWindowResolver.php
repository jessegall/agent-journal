<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Agents\Contracts\AccountUses;
use App\Drivers\Enums\HookDriver;
use App\Http\Data\Profiles\AccountListData;
use App\Http\Data\Profiles\AccountRowData;
use App\Http\Data\Profiles\AccountUsageData;
use App\Http\Data\Profiles\DriverMethodsData;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountUsageCost;
use App\Profiles\Models\AccountUsageTokens;
use App\Profiles\Models\AccountUsageWindow;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInProtocols;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use Carbon\CarbonImmutable;

/**
 * The Accounts page: every saved account that is not removed, with whether new starts use it, how many starts run on
 * it as Core counts them and the usage its drivers reported, read for all rows at once, and each driver's choice.
 */
final readonly class AccountsWindowResolver implements PageResolver
{
    private const int RECENT_STARTS = 5;

    public function __construct(private AccountUses $uses, private SignInProtocols $protocols) {}

    public function read(): DeclaredLayoutData
    {
        $accounts = Account::listed();
        $selections = ActiveAccount::listed();
        $list = LayoutNativeData::of('accounts/AccountsWindow', $this->listOf($accounts, $selections));

        return DeclaredLayoutData::of(LayoutPartData::box(
            'accounts-page',
            'stack',
            $this->startsOf($accounts, $selections),
            LayoutPartData::native('accounts', $list),
        ));
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
                fn (HookDriver $driver) => DriverMethodsData::fromMethods(
                    $driver,
                    $this->protocols->methodsOf($driver->value),
                ),
                HookDriver::cases(),
            ),
        ]);
    }

    /**
     * Which saved account new starts of each driver use, as shared fact rows above the native list.
     *
     * @param  list<Account>  $accounts
     * @param  list<ActiveAccount>  $selections
     */
    private function startsOf(array $accounts, array $selections): LayoutPartData
    {
        $labels = [];

        foreach ($accounts as $account) {
            $labels[$account->id] = $account->label;
        }

        $chosen = [];

        foreach ($selections as $selection) {
            $chosen[$selection->driver] = $selection->account_id === null
                ? 'none chosen'
                : $labels[$selection->account_id] ?? 'a removed account';
        }

        return LayoutPartData::collection('starts', 'facts', array_map(
            fn (HookDriver $driver) => new LayoutRowData(
                $driver->value,
                "New {$driver->value} starts use",
                $chosen[$driver->value] ?? 'none chosen',
            ),
            HookDriver::cases(),
        ));
    }
}

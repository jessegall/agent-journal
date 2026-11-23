<?php

declare(strict_types=1);

namespace App\Http\Pages\Accounts;

use App\Data\Profiles\AccountListData;
use App\Data\Profiles\AccountMonthCostData;
use App\Data\Profiles\AccountRowData;
use App\Data\Profiles\AccountThreadTokensData;
use App\Data\Profiles\AccountUsageData;
use App\Data\Profiles\AccountUsageWindowData;
use App\Enums\AccountState;
use App\Enums\ActionMethod;
use App\Enums\UsageWindowSlot;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use App\Support\Layout\SettingsGroup;
use App\Support\Layout\SettingsRow;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;

/**
 * The accounts on the shared list and reader recipes: each account by its driver mark, name and type with its sign-in
 * state, and the reader of the one chosen with its usage as measured readings, their units and reset times, the choice
 * of the account new starts of its driver use, and, for one that needs it, signing in again. Add account opens the
 * native sign-in flow in the reader, since its challenge steps are not declared.
 */
final readonly class AccountsIndex
{
    private const int WEEK_MINUTES = 10080;

    private const int SESSION_MINUTES = 300;

    /**
     * @param  string  $chosen  the id of the account to read, or '' for none
     */
    public function of(AccountListData $accounts, string $chosen, bool $isAdding): DeclaredLayoutData
    {
        $reader = $isAdding
            ? [LayoutPartData::native('sign-in', LayoutNativeData::of('accounts/AddAccountPart', $accounts))]
            : $this->readerOf($accounts, $chosen);

        $adding = LayoutActionData::changing(['add' => '1', 'account' => '']);

        return ListPage::make(
            'Accounts',
            array_map(fn (AccountRowData $row) => $this->rowOf($row, $chosen), $accounts->rows),
            ListEmpty::nothingYet(
                'No accounts yet',
                'Agents run on an account. Add a Claude Code or Codex account so they can start work.',
                'account',
                LayoutPartData::action('add', 'Add account', $adding, 'primary'),
            ),
        )
            ->counting(count($accounts->rows))
            ->creating('Add account', $adding)
            ->withReader(new LayoutBackData(route('accounts.accounts', [], false), 'Accounts'), ...$reader)
            ->layout();
    }

    private function rowOf(AccountRowData $row, string $chosen): LayoutRowData
    {
        return LayoutRowData::from([
            'key' => $row->id,
            'label' => $row->label,
            'detail' => "{$row->driver} · {$row->signIn->title}",
            'query' => [
                'account' => $row->id,
                'add' => '',
            ],
            'isCurrent' => $row->id === $chosen,
            'leading' => [
                LayoutPartData::text('driver', $row->driver, 'driver'),
            ],
            'trailing' => [
                LayoutPartData::badge('state', $this->stateWord($row->state), $this->stateTone($row->state)),
                ...$this->usageMeterOf($row),
            ],
        ]);
    }

    /**
     * The row's usage as the design draws it beside the state: the meter alone, at the most used of the windows a
     * driver measured, with every window's reading as its tip; none when nothing was measured.
     *
     * @return list<LayoutPartData>
     */
    private function usageMeterOf(AccountRowData $row): array
    {
        if (! $row->usage instanceof AccountUsageData) {
            return [];
        }

        $measured = array_values(array_filter(
            $row->usage->windows,
            fn (AccountUsageWindowData $window) => $window->usedPercent !== null,
        ));

        if ($measured === []) {
            return [];
        }

        $tip = implode(' · ', array_map(
            fn (AccountUsageWindowData $window) => "{$this->windowLabel($window)} {$this->percentWord($window)}",
            $measured,
        ));

        return [
            LayoutPartData::usage(
                'usage',
                max(array_map(fn (AccountUsageWindowData $window) => (float) $window->usedPercent, $measured)),
                'Usage',
                $tip,
            ),
        ];
    }

    /**
     * @return list<LayoutPartData>
     */
    private function readerOf(AccountListData $accounts, string $chosen): array
    {
        $row = array_find($accounts->rows, fn (AccountRowData $each) => $each->id === $chosen);

        if ($row === null) {
            return [];
        }

        $groups = [$this->identityGroup($row)];

        if ($row->usage instanceof AccountUsageData) {
            $groups[] = $this->usageGroup($row->usage);
        }

        return [
            DetailPage::make($row->label)
                ->above(LayoutPartData::text('driver', $row->driver, 'driver'))
                ->withActions(...$this->actionsOf($row))
                ->withStanding(...array_map(fn (SettingsGroup $group) => $group->part(), $groups))
                ->part(),
        ];
    }

    private function identityGroup(AccountRowData $row): SettingsGroup
    {
        $rows = [SettingsRow::value('state', 'Status', $this->stateWord($row->state))];

        if ($row->identity !== null) {
            $rows[] = SettingsRow::value('identity', 'Signed in as', $row->identity);
        }

        if ($row->workspace !== null) {
            $rows[] = SettingsRow::value('workspace', 'Workspace', $row->workspace);
        }

        return SettingsGroup::make('account', 'Account')->withRows(...$rows);
    }

    /**
     * The usage readings: each window with its reset time and a meter below its label, the cost of the current UTC
     * month, and the newest thread count with its own unit; a window no driver measured says Usage unavailable.
     */
    private function usageGroup(AccountUsageData $usage): SettingsGroup
    {
        $rows = array_map(fn (AccountUsageWindowData $window) => $this->windowRow($window), $usage->windows);

        if ($usage->monthCost instanceof AccountMonthCostData) {
            $month = CarbonImmutable::parse($usage->monthCost->monthStart)->format('F Y');

            $rows[] = SettingsRow::value(
                'cost',
                'Estimated cost this month (USD)',
                $usage->monthCost->usd,
                "{$month} UTC, last observed {$usage->monthCost->lastObservedAt}",
            )->inBlock();
        }

        if ($usage->latestThread instanceof AccountThreadTokensData) {
            $rows[] = SettingsRow::value(
                'thread',
                'Latest thread',
                "{$usage->latestThread->total} tokens",
                "Observed {$usage->latestThread->observedAt}",
            )->inBlock();
        }

        return SettingsGroup::make('usage', 'Usage')->withRows(...$rows);
    }

    private function windowRow(AccountUsageWindowData $window): SettingsRow
    {
        $key = $window->limitId.$window->slot->value;
        $label = $this->windowLabel($window);
        $reset = $window->resetsAt === null ? null : "Resets {$this->resetWord($window->resetsAt)}.";

        if ($window->usedPercent === null) {
            return SettingsRow::value($key, $label, 'Usage unavailable', $reset)->inBlock();
        }

        return SettingsRow::reading(
            $key,
            $label,
            LayoutPartData::usage('meter', $window->usedPercent, "{$label} used"),
            $reset,
        );
    }

    /**
     * The window as the design names it: this week for the seven-day window and this session, the last 5 hours, for
     * the five-hour one, by the length a driver reported when its slot does not say.
     */
    private function windowLabel(AccountUsageWindowData $window): string
    {
        $isWeek = $window->slot === UsageWindowSlot::SevenDay || $window->windowMinutes === self::WEEK_MINUTES;
        $isSession = $window->slot === UsageWindowSlot::FiveHour || $window->windowMinutes === self::SESSION_MINUTES;

        return match (true) {
            $isWeek => 'This week',
            $isSession => 'This session, the last 5 hours',
            default => ucfirst(str_replace('_', ' ', $window->slot->value)),
        };
    }

    private function resetWord(string $resetsAt): string
    {
        return CarbonImmutable::parse($resetsAt)->diffForHumans(['syntax' => CarbonInterface::DIFF_RELATIVE_AUTO]);
    }

    private function percentWord(AccountUsageWindowData $window): string
    {
        return ((int) round((float) $window->usedPercent)).'% used';
    }

    /**
     * Active for the driver, for a signed-in account that is not the one new starts use; sign in again for one that
     * needs it. Each is the account's own registered action.
     *
     * @return list<LayoutPartData>
     */
    private function actionsOf(AccountRowData $row): array
    {
        if ($row->state === AccountState::NeedsSignIn) {
            return [$this->form('sign-in-again', 'accounts.sign-in-again', $row->id, 'Sign in again')];
        }

        if ($row->state === AccountState::SignedIn && ! $row->isActive) {
            return [$this->form('activate', 'accounts.activate', $row->id, "Active for {$row->driver}")];
        }

        return $row->isActive ? [LayoutPartData::text('active', "Active for {$row->driver}", 'muted')] : [];
    }

    private function form(string $key, string $route, string $account, string $label): LayoutPartData
    {
        return LayoutPartData::form(
            $key,
            LayoutFormData::from(
                [
                    'method' => ActionMethod::Post,
                    'href' => route($route, ['account' => $account], false),
                    'isKeyed' => true,
                ],
            ),
            'inline',
            LayoutPartData::action("{$key}-send", $label, LayoutActionData::submitting()),
        );
    }

    private function stateWord(AccountState $state): string
    {
        return match ($state) {
            AccountState::SignedIn => 'Signed in',
            AccountState::NeedsSignIn => 'Signed out',
            AccountState::Removing => 'Removing',
            AccountState::Removed => 'Removed',
        };
    }

    private function stateTone(AccountState $state): string
    {
        return match ($state) {
            AccountState::SignedIn => 'good',
            AccountState::NeedsSignIn => 'warn',
            AccountState::Removing, AccountState::Removed => 'quiet',
        };
    }
}

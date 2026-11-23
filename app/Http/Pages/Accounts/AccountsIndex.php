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

/**
 * The accounts on the shared list and reader recipes: each account by its driver mark, name and type with its sign-in
 * state, and the reader of the one chosen with its usage as measured readings, their units and reset times, the choice
 * of the account new starts of its driver use, and, for one that needs it, signing in again. Add account opens the
 * native sign-in flow in the reader, since its challenge steps are not declared.
 */
final readonly class AccountsIndex
{
    /**
     * @param  string  $chosen  the id of the account to read, or '' for none
     */
    public function of(AccountListData $accounts, string $chosen, bool $isAdding): DeclaredLayoutData
    {
        $reader = $isAdding
            ? [LayoutPartData::native('sign-in', LayoutNativeData::of('accounts/AddAccountPart', $accounts))]
            : $this->readerOf($accounts, $chosen);

        return ListPage::make(
            'Accounts',
            array_map(fn (AccountRowData $row) => $this->rowOf($row, $chosen), $accounts->rows),
            ListEmpty::informing('No accounts yet.'),
        )
            ->counting(count($accounts->rows))
            ->creating('Add account', LayoutActionData::changing(['add' => '1', 'account' => '']))
            ->withReader(new LayoutBackData(route('accounts.accounts', [], false), 'Accounts'), ...$reader)
            ->layout();
    }

    private function rowOf(AccountRowData $row, string $chosen): LayoutRowData
    {
        return LayoutRowData::from(['key' => $row->id, 'label' => $row->label, 'detail' => "{$row->driver} · {$row->signIn->title}", 'query' => ['account' => $row->id, 'add' => ''], 'isCurrent' => $row->id === $chosen, 'leading' => [
            LayoutPartData::text('driver', $row->driver, 'driver'),
        ], 'trailing' => [
            LayoutPartData::badge('state', $this->stateWord($row->state), $this->stateTone($row->state)),
            ...$this->usageMeterOf($row),
        ]]);
    }

    /**
     * The row's usage as the design draws it beside the state: the first window a driver measured, as a meter; none
     * when nothing was measured.
     *
     * @return list<LayoutPartData>
     */
    private function usageMeterOf(AccountRowData $row): array
    {
        if (! $row->usage instanceof AccountUsageData) {
            return [];
        }

        foreach ($row->usage->windows as $window) {
            if ($window->usedPercent !== null) {
                return [LayoutPartData::progress('usage', $window->usedPercent, 100, 'Usage', 'percent')];
            }
        }

        return [];
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

        $groups = [
            $this->identityGroup($row),
            ...($row->usage instanceof AccountUsageData ? [$this->usageGroup($row->usage)] : []),
        ];

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
        return SettingsGroup::make('account', 'Account')->withRows(
            SettingsRow::value('state', 'Status', $this->stateWord($row->state)),
            ...($row->identity === null ? [] : [SettingsRow::value('identity', 'Signed in as', $row->identity)]),
            ...($row->workspace === null ? [] : [SettingsRow::value('workspace', 'Workspace', $row->workspace)]),
        );
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
        $label = $window->slot->value === 'seven_day' ? 'Weekly' : ucfirst(str_replace('_', ' ', $window->slot->value));
        $reset = $window->resetsAt === null ? null : "Resets {$window->resetsAt}";

        if ($window->usedPercent === null) {
            return SettingsRow::value($key, $label, 'Usage unavailable', $reset)->inBlock();
        }

        return SettingsRow::reading(
            $key,
            $label,
            LayoutPartData::progress('meter', $window->usedPercent, 100, "{$label} used", 'percent'),
            $reset,
        );
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
                ['method' => ActionMethod::Post, 'href' => route($route, ['account' => $account], false), 'isKeyed' => true],
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

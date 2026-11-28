<?php

declare(strict_types=1);

namespace App\Http\Pages\Accounts;

use App\Accounts\Data\AccountListData;
use App\Accounts\Data\AccountRowData;
use App\Accounts\Data\AccountUsageData;
use App\Accounts\Data\AccountUsageWindowData;
use App\Accounts\Enums\AccountStatus;
use App\Accounts\Enums\UsageWindowSlot;
use App\Accounts\NoAccountsYet;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Settings\Enums\ActionMethod;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListPage;
use App\Support\Layout\SettingsGroup;
use App\Support\Layout\SettingsRow;
use Carbon\CarbonImmutable;

/**
 * The accounts as the design draws them: each by its driver mark, name, type and sign-in state, and the reader of the
 * chosen one with Name, Make default, Sign-in and its usage readings. Add account opens the native sign-in flow in the
 * reader, since its steps are not declared.
 */
final readonly class AccountsIndex extends AccountsPage
{
    public const string WEEK_LABEL = 'This week';

    public const string SESSION_LABEL = 'This session, the last 5 hours';

    private const int WEEK_MINUTES = 10080;

    private const int SESSION_MINUTES = 300;

    public function __construct(private DriverCatalogue $drivers) {}

    /**
     * @param  string  $chosen  the id of the account to read, or '' for none
     */
    public function of(AccountListData $accounts, string $chosen, bool $isAdding): DeclaredLayoutData
    {
        $reader = $isAdding
            ? [LayoutPartData::build()
                ->asNative()
                ->key('sign-in')
                ->native(
                    LayoutNativeData::build()->component('accounts/AddAccountPart')->props($accounts)->finish(),
                )
                ->finish()]
            : $this->readerOf($accounts, $chosen);

        $adding = LayoutActionData::build()->query(['add' => '1', 'account' => ''])->finish();

        return ListPage::make(
            'Accounts',
            array_map(fn (AccountRowData $row) => $this->rowOf($row, $chosen), $accounts->rows),
            NoAccountsYet::addingWith($adding),
        )
            ->countingRows()
            ->creating('Add account', $adding)
            ->withReader(LayoutBackData::build()
                ->href(route('accounts.accounts', [], false))
                ->label('Accounts')
                ->finish(), ...$reader)
            ->layout();
    }

    private function rowOf(AccountRowData $row, string $chosen): LayoutRowData
    {
        return LayoutRowData::build()
            ->key($row->id)
            ->label($row->label)
            ->detail($this->detailOf($row))
            ->query(['account' => $row->id, 'add' => ''])
            ->isCurrent($row->id === $chosen)
            ->hasColumns(true)
            ->leading(
                [LayoutPartData::build()
                ->asText()
                ->key('driver')
                ->value($row->driver)
                ->style('driver')
                ->finish()],
            )
            ->trailing(
                [
                    ...$this->usageMeterOf($row),
                    LayoutPartData::build()
                        ->asBadge()
                        ->key('state')
                        ->text($this->stateWordOf($row))
                        ->tone($this->stateToneOf($row))
                        ->finish(),
                ],
            )
            ->finish();
    }

    /**
     * The row's second line as the design words it: what kind of account it is, such as Claude Code subscription,
     * then default when new starts use it.
     */
    private function detailOf(AccountRowData $row): string
    {
        $type = $this->typeOf($row);

        if ($row->isActive) {
            return "{$type} · default";
        }

        return $type;
    }

    private function typeOf(AccountRowData $row): string
    {
        $driver = $this->drivers->family($row->driver);

        return $row->signIn->accountTypeFor($driver->label);
    }

    /**
     * The line under the reader's title as the design draws it: the kind of account and, when its sign-in ends on a
     * known day, that day.
     */
    private function summaryOf(AccountRowData $row): string
    {
        $type = $this->typeOf($row);

        if ($row->expiresAt === null) {
            return $type;
        }

        return "{$type} · Expires {$this->dayOf($row->expiresAt)}";
    }

    private function dayOf(string $moment): string
    {
        return CarbonImmutable::parse($moment)->format('j M Y');
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

        $measuredWindows = array_values(array_filter(
            $row->usage->windows,
            fn (AccountUsageWindowData $window) => $window->usedPercent !== null,
        ));

        if ($measuredWindows === []) {
            return [];
        }

        $readings = implode(' · ', array_map(
            fn (AccountUsageWindowData $window) => "{$this->windowLabel($window)} {$this->usedText($window)}",
            $measuredWindows,
        ));

        return [
            LayoutPartData::build()
                ->asUsage()
                ->key('usage')
                ->progress(
                    LayoutProgressData::build()
                    ->value(
                        max(array_map(fn (AccountUsageWindowData $window) => (float) $window->usedPercent, $measuredWindows)),
                    )
                    ->max(100)
                    ->label('Usage')
                    ->unit('percent')
                    ->finish(),
                )
                ->tip($readings)
                ->finish(),
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
            DetailPage::build()->title($row->label)->finish()
                ->summarising($this->summaryOf($row))
                ->withStanding(...array_map(fn (SettingsGroup $group) => $group->part(), $groups))
                ->part(),
        ];
    }

    /**
     * The account as the design draws it: its Name, Make default for a signed-in account that is not the default yet,
     * and the Sign-in row with its state or the button that signs in again.
     */
    private function identityGroup(AccountRowData $row): SettingsGroup
    {
        $rows = [$this->nameRow($row)];

        if ($row->status === AccountStatus::Authenticated) {
            $rows[] = $this->defaultRow($row);
        }

        $rows[] = SettingsRow::build()
            ->key('sign-in')
            ->label('Sign-in')
            ->control(
                $row->status === AccountStatus::Unauthenticated
                ? $this->form('sign-in-again', 'accounts.sign-in-again', $row->id, 'Sign in again')
                : LayoutPartData::build()
                    ->asBadge()
                    ->key('state')
                    ->text($this->stateWordOf($row))
                    ->tone($this->stateToneOf($row))
                    ->finish(),
            )
            ->help($this->signInHelp($row))
            ->finish();

        return SettingsGroup::build()->key('account')->title('Account')->finish()->leading()->withRows(...$rows);
    }

    private function nameRow(AccountRowData $row): SettingsRow
    {
        $rename = LayoutFormData::build()
            ->method(ActionMethod::Patch)
            ->href(route('accounts.rename', ['account' => $row->id], false))
            ->fixed(['seenRevision' => $row->nameRevision])
            ->isKeyed(true)
            ->finish();

        return SettingsRow::build()
            ->key('name')
            ->label('Name')
            ->control(
                LayoutPartData::build()
                ->asForm()
                ->key('rename')
                ->form($rename)
                ->style('live')
                ->children(
                    LayoutPartData::build()
                    ->asField()
                    ->key('label')
                    ->label('Name')
                    ->field(LayoutFieldData::build()->name('label')->value($row->label)->finish())
                    ->style('text')
                    ->finish(),
                )
                ->finish(),
            )
            ->help('Shown in the account list and the agent bar.')
            ->finish();
    }

    private function defaultRow(AccountRowData $row): SettingsRow
    {
        $help = 'Agents use this account when no other is named.';

        $activate = LayoutFormData::build()
            ->method(ActionMethod::Post)
            ->href(route('accounts.activate', ['account' => $row->id], false))
            ->isKeyed(true)
            ->finish();

        return SettingsRow::build()
            ->key('default')
            ->label('Make default')
            ->control(
                LayoutPartData::build()
                ->asForm()
                ->key('activate')
                ->form($activate)
                ->style('live')
                ->children(
                    LayoutPartData::build()
                    ->asField()
                    ->key('isDefault')
                    ->label('Make default')
                    ->field(
                        LayoutFieldData::build()->name('isDefault')->value($row->isActive ? '1' : '0')->finish(),
                    )
                    ->style('toggle')
                    ->finish(),
                )
                ->finish(),
            )
            ->help($help)
            ->finish();
    }

    private function signInHelp(AccountRowData $row): string
    {
        return match (true) {
            $row->status === AccountStatus::Authenticated && $row->expiresAt !== null => "Signed in. It expires on {$this->dayOf($row->expiresAt)}.",
            $row->status === AccountStatus::Authenticated => 'Signed in.',
            $this->hasExpired($row) => 'Expired. Sign in again so agents can use it.',
            default => 'Not signed in yet. Sign in so agents can use it.',
        };
    }

    private function hasExpired(AccountRowData $row): bool
    {
        return $row->expiresAt !== null && CarbonImmutable::parse($row->expiresAt)->isPast();
    }

    /**
     * The usage readings as the design draws them: each window with its reset time and a meter below its label; a
     * window no driver measured says Usage unavailable.
     */
    private function usageGroup(AccountUsageData $usage): SettingsGroup
    {
        $rows = array_map(fn (AccountUsageWindowData $window) => $this->windowRow($window), $usage->windows);

        return SettingsGroup::build()->key('usage')->title('Usage')->finish()->withRows(...$rows);
    }

    private function windowRow(AccountUsageWindowData $window): SettingsRow
    {
        $key = $window->limitId.$window->slot->value;
        $label = $this->windowLabel($window);
        $reset = $window->resetsAt === null ? null : "Resets {$this->resetTime($window->resetsAt)}.";

        if ($window->usedPercent === null) {
            return SettingsRow::build()
                ->key($key)
                ->label($label)
                ->value('Usage unavailable')
                ->help($reset)
                ->finish()->inBlock();
        }

        return SettingsRow::build()
            ->key($key)
            ->label($label)
            ->control(
                LayoutPartData::build()
                ->asUsage()
                ->key('meter')
                ->progress(
                    LayoutProgressData::build()
                    ->value($window->usedPercent)
                    ->max(100)
                    ->label("{$label} used")
                    ->unit('percent')
                    ->finish(),
                )
                ->finish(),
            )
            ->help($reset)
            ->isBlock(true)
            ->finish();
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
            $isWeek => self::WEEK_LABEL,
            $isSession => self::SESSION_LABEL,
            default => ucfirst(str_replace('_', ' ', $window->slot->value)),
        };
    }

    /**
     * When a window resets, counted from now in the largest whole unit: minutes under an hour, hours under two days,
     * days after that.
     */
    private function resetTime(string $resetsAt): string
    {
        $minutes = max(1, (int) ceil(CarbonImmutable::now()->diffInMinutes(CarbonImmutable::parse($resetsAt))));

        return match (true) {
            $minutes < 60 => "in {$minutes} min",
            $minutes < 2880 => 'in '.intdiv($minutes, 60).' h',
            default => 'in '.intdiv($minutes, 1440).' days',
        };
    }

    private function usedText(AccountUsageWindowData $window): string
    {
        return ((int) round((float) $window->usedPercent)).'% used';
    }

    private function form(string $key, string $route, string $account, string $label): LayoutPartData
    {
        return LayoutPartData::build()
            ->asForm()
            ->key($key)
            ->form(
                LayoutFormData::build()
                    ->method(ActionMethod::Post)
                    ->href(route($route, ['account' => $account], false))
                    ->isKeyed(true)
                    ->finish(),
            )
            ->style('inline')
            ->children(
                LayoutPartData::build()
                ->asAction()
                ->key("{$key}-send")
                ->label($label)
                ->action(LayoutActionData::build()->submits(true)->finish())
                ->finish(),
            )
            ->finish();
    }

    /**
     * Not signed in and expired are states that have not started, drawn with a hollow dot; the rest are quiet.
     */
    private function stateToneOf(AccountRowData $row): string
    {
        if ($row->status === AccountStatus::Unauthenticated) {
            return 'waiting';
        }

        return 'quiet';
    }

    private function stateWordOf(AccountRowData $row): string
    {
        return match (true) {
            $row->status === AccountStatus::Authenticated => 'Signed in',
            $row->status === AccountStatus::Unauthenticated && $this->hasExpired($row) => 'Expired',
            $row->status === AccountStatus::Unauthenticated => 'Not signed in',
            $row->status === AccountStatus::Removing => 'Removing',
            default => 'Removed',
        };
    }
}

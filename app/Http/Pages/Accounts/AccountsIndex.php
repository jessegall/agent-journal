<?php

declare(strict_types=1);

namespace App\Http\Pages\Accounts;

use App\Contracts\Drivers\DriverCatalogue;
use App\Data\Accounts\AccountListData;
use App\Data\Accounts\AccountRowData;
use App\Data\Accounts\AccountUsageData;
use App\Data\Accounts\AccountUsageWindowData;
use App\Enums\AccountState;
use App\Enums\ActionMethod;
use App\Enums\UsageWindowSlot;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutFieldData;
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
 * The accounts on the shared list and reader recipes, as the design draws them: each account by its driver mark, name
 * and type with its sign-in state, and the reader of the one chosen with its Name, Make default, Sign-in and its usage
 * as measured readings with their reset times. Add account opens the native sign-in flow in the reader, since its
 * challenge steps are not declared.
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
            'detail' => $this->detailOf($row),
            'query' => [
                'account' => $row->id,
                'add' => '',
            ],
            'isCurrent' => $row->id === $chosen,
            'hasColumns' => true,
            'leading' => [
                LayoutPartData::text('driver', $row->driver, 'driver'),
            ],
            'trailing' => [
                ...$this->usageMeterOf($row),
                LayoutPartData::badge('state', $this->stateWordOf($row), $this->stateToneOf($row)),
            ],
        ]);
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
            LayoutPartData::usage(
                'usage',
                max(array_map(fn (AccountUsageWindowData $window) => (float) $window->usedPercent, $measuredWindows)),
                'Usage',
                $readings,
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

        if ($row->state === AccountState::SignedIn) {
            $rows[] = $this->defaultRow($row);
        }

        $rows[] = SettingsRow::control(
            'sign-in',
            'Sign-in',
            $row->state === AccountState::NeedsSignIn
                ? $this->form('sign-in-again', 'accounts.sign-in-again', $row->id, 'Sign in again')
                : LayoutPartData::badge('state', $this->stateWordOf($row), $this->stateToneOf($row)),
            $this->signInHelp($row),
        );

        return SettingsGroup::make('account', 'Account')->leading()->withRows(...$rows);
    }

    private function nameRow(AccountRowData $row): SettingsRow
    {
        $rename = LayoutFormData::from([
            'method' => ActionMethod::Patch,
            'href' => route('accounts.rename', ['account' => $row->id], false),
            'fixed' => ['seenRevision' => $row->nameRevision],
            'isKeyed' => true,
        ]);

        return SettingsRow::control(
            'name',
            'Name',
            LayoutPartData::form(
                'rename',
                $rename,
                'live',
                LayoutPartData::field('label', 'Name', new LayoutFieldData('label', $row->label), 'text'),
            ),
            'Shown in the account list and the agent bar.',
        );
    }

    private function defaultRow(AccountRowData $row): SettingsRow
    {
        $help = 'Agents use this account when no other is named.';

        $activate = LayoutFormData::from([
            'method' => ActionMethod::Post,
            'href' => route('accounts.activate', ['account' => $row->id], false),
            'isKeyed' => true,
        ]);

        return SettingsRow::control(
            'default',
            'Make default',
            LayoutPartData::form(
                'activate',
                $activate,
                'live',
                LayoutPartData::field(
                    'isDefault',
                    'Make default',
                    new LayoutFieldData('isDefault', $row->isActive ? '1' : '0'),
                    'toggle',
                ),
            ),
            $help,
        );
    }

    private function signInHelp(AccountRowData $row): string
    {
        return match (true) {
            $row->state === AccountState::SignedIn && $row->expiresAt !== null => "Signed in. It expires on {$this->dayOf($row->expiresAt)}.",
            $row->state === AccountState::SignedIn => 'Signed in.',
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

        return SettingsGroup::make('usage', 'Usage')->withRows(...$rows);
    }

    private function windowRow(AccountUsageWindowData $window): SettingsRow
    {
        $key = $window->limitId.$window->slot->value;
        $label = $this->windowLabel($window);
        $reset = $window->resetsAt === null ? null : "Resets {$this->resetTime($window->resetsAt)}.";

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

    /**
     * Not signed in and expired are states that have not begun, drawn with a hollow dot; the rest are quiet.
     */
    private function stateToneOf(AccountRowData $row): string
    {
        if ($row->state === AccountState::NeedsSignIn) {
            return 'waiting';
        }

        return 'quiet';
    }

    private function stateWordOf(AccountRowData $row): string
    {
        return match (true) {
            $row->state === AccountState::SignedIn => 'Signed in',
            $row->state === AccountState::NeedsSignIn && $this->hasExpired($row) => 'Expired',
            $row->state === AccountState::NeedsSignIn => 'Not signed in',
            $row->state === AccountState::Removing => 'Removing',
            default => 'Removed',
        };
    }
}

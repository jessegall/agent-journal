<?php

declare(strict_types=1);

namespace App\Models\Accounts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\StartUnavailableReason;
use App\Events\Accounts\AccountSwitched;
use App\Events\Accounts\ActiveAccountCleared;
use App\Events\Accounts\ActiveAccountSelected;
use App\Exceptions\AccountSelectionChanged;
use App\Exceptions\AccountUnavailable;
use App\Models\Support\AccountOwnerScope;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property string $id
 * @property string $account_protocol
 * @property ?string $account_id
 * @property bool $has_selected
 * @property int $change_number
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Fillable(['account_protocol'])]
final class ActiveAccount extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'has_selected' => 'boolean',
            'change_number' => 'integer',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * The owner's choice of the account new starts use, announced on the Accounts page when it changed anything.
     *
     * @throws AccountUnavailable
     */
    public function switchTo(Account $account): bool
    {
        if (! $this->select($account)) {
            return false;
        }

        $this->raise(new AccountSwitched($this->account_protocol, $account->id));

        return true;
    }

    /**
     * Makes the account the one new starts use, and answers whether that changed anything: choosing the one already
     * chosen does not. Starts already running keep the account they started with.
     *
     * @throws AccountUnavailable
     */
    public function select(Account $account): bool
    {
        $account->assertAvailable();

        if ($this->account_id === $account->id) {
            return false;
        }

        $this->account_id = $account->id;
        $this->has_selected = true;
        $this->change_number++;
        $this->assertSaved($this->save());
        $this->raise(new ActiveAccountSelected($this->account_protocol, $account->id));

        return true;
    }

    /**
     * Leaves the driver with no chosen account, as when the chosen one must sign in again or is removed.
     */
    public function clear(): void
    {
        if ($this->account_id === null) {
            return;
        }

        $this->account_id = null;
        $this->change_number++;
        $this->save();
        $this->raise(new ActiveAccountCleared($this->account_protocol));
    }

    /**
     * Chooses the account when the driver never had one chosen, as for its first signed-in account.
     */
    public function chooseFirst(Account $account): void
    {
        if ($this->has_selected) {
            return;
        }

        $this->select($account);
    }

    /**
     * Leaves the driver with no chosen account when the given one was chosen, as when it must sign in again.
     */
    public function clearIfChosen(Account $account): void
    {
        if ($this->account_id === $account->id) {
            $this->clear();
        }
    }

    // ----------[ Asserts ]----------

    /**
     * @throws AccountSelectionChanged when the choice changed since the change number the caller saw
     */
    public function assertAtChange(int $number): void
    {
        if ($this->change_number !== $number) {
            throw AccountSelectionChanged::forDriver($this->account_protocol);
        }
    }

    /**
     * Refuses a start for a driver with no account chosen.
     *
     * @phpstan-assert string $accountId
     *
     * @throws AccountUnavailable
     */
    private static function assertAccountChosen(string|null $accountId, string $driver): void
    {
        if ($accountId === null) {
            throw AccountUnavailable::forStart($driver, StartUnavailableReason::NoAccount);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The driver's selection row, made when it is first needed and locked for the rest of the transaction; two
     * requests that make it at once end with the same one row.
     */
    public static function lockedFor(string $driver): self
    {
        self::makeIfAbsent($driver);

        return self::query()->ofDriver($driver)->lockForUpdate()->firstOrFail();
    }

    /**
     * The account the driver's starts use, with the selection and then the account locked for the start's
     * transaction; the start path's own read, which no request's actor limits.
     *
     * @throws AccountUnavailable
     */
    public static function lockedAccountForStart(string $driver): Account
    {
        $selection = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofDriver($driver)
            ->lockForUpdate()
            ->first();
        $accountId = $selection?->account_id;
        self::assertAccountChosen($accountId, $driver);

        return Account::lockedForStart($accountId);
    }

    /**
     * The driver's selection row for the journal's own maintenance or the host, made when first needed and locked;
     * whoever acts.
     */
    public static function lockedForJournal(string $driver): self
    {
        self::makeIfAbsent($driver);

        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofDriver($driver)
            ->lockForUpdate()
            ->firstOrFail();
    }

    /**
     * The account new starts of the driver use, none while the owner chose none; read under the owner's scope.
     */
    public static function defaultAccountIdOf(string $driver): string|null
    {
        return self::query()->ofDriver($driver)->value('account_id');
    }

    /**
     * Each driver's current choice, one row per driver made so far.
     *
     * @return list<self>
     */
    public static function listed(): array
    {
        return array_values(self::query()->inDriverOrder()->readAll('one row per driver')->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDriver(Builder $query, string $driver): void
    {
        $query->where('account_protocol', $driver);
    }

    /**
     * Makes the driver's selection row when none exists yet; two requests that make it at once leave one row.
     */
    private static function makeIfAbsent(string $driver): void
    {
        $selection = new self();
        $selection->id = strtolower((string) Str::ulid());
        $selection->account_protocol = $driver;
        $selection->has_selected = false;
        $selection->change_number = 0;
        $selection->insertIfAbsent();
    }

    /**
     * The selections in the order of their driver.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inDriverOrder(Builder $query): void
    {
        $query->orderBy('account_protocol');
    }
}

<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Agents\Enums\StartUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Drivers\Enums\HookDriver;
use App\Links\Support\Linkable;
use App\Profiles\Events\AccountSwitched;
use App\Profiles\Exceptions\AccountSelectionChanged;
use App\Profiles\Models\Support\AccountOwnerScope;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * Which saved account new starts of one program use: one row per program, made the first time it is needed, with a
 * change number that only grows so a page can tell a newer choice from an older one.
 *
 * @property string $id
 * @property string $driver
 * @property string|null $account_id
 * @property bool $has_selected
 * @property int $change_number
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['driver'])]
final class ActiveAccount extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'core.active-account';

    // ----------[ Constructors ]----------

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

    // ----------[ Queries ]----------

    /**
     * The program's selection row, made when it is first needed and locked for the rest of the transaction; two
     * requests that make it at once end with the same one row.
     */
    public static function lockedFor(HookDriver $driver): self
    {
        self::makeIfAbsent($driver);

        return self::query()->ofDriver($driver)->lockForUpdate()->firstOrFail();
    }

    /**
     * The account the program's starts use, with the selection and then the account locked for the start's
     * transaction; the start path's own read, which no request's actor limits.
     *
     * @throws AccountUnavailable
     */
    public static function lockedAccountForStart(HookDriver $driver): Account
    {
        $selection = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofDriver($driver)
            ->lockForUpdate()
            ->first();

        if ($selection === null || $selection->account_id === null) {
            throw AccountUnavailable::forStart($driver->value, StartUnavailableReason::NoAccount);
        }

        return Account::lockedForStart($selection->account_id);
    }

    /**
     * The program's selection row for the journal's own maintenance or the host, made when first needed and locked;
     * whoever acts.
     */
    public static function lockedForJournal(HookDriver $driver): self
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
    public static function defaultAccountIdOf(HookDriver $driver): string|null
    {
        return self::query()->ofDriver($driver)->value('account_id');
    }

    /**
     * Each program's current choice, one row per program made so far.
     *
     * @return list<self>
     */
    public static function listed(): array
    {
        return array_values(self::query()->orderBy('driver')->readAll('one row per program')->get()->all());
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

        $this->raise(new AccountSwitched($this->driver, $account->id));

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

        return true;
    }

    /**
     * Leaves the program with no chosen account, as when the chosen one must sign in again or is removed.
     */
    public function clear(): void
    {
        if ($this->account_id === null) {
            return;
        }

        $this->account_id = null;
        $this->change_number++;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * @throws AccountSelectionChanged when the choice changed since the change number the caller saw
     */
    public function assertAtChange(int $changeNumber): void
    {
        if ($this->change_number !== $changeNumber) {
            throw AccountSelectionChanged::forDriver($this->driver);
        }
    }

    /**
     * Chooses the account when the program never had one chosen, as for its first signed-in account.
     */
    public function chooseFirst(Account $account): void
    {
        if ($this->has_selected) {
            return;
        }

        $this->select($account);
    }

    /**
     * Leaves the program with no chosen account when the given one was chosen, as when it must sign in again.
     */
    public function clearIfChosen(Account $account): void
    {
        if ($this->account_id === $account->id) {
            $this->clear();
        }
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDriver(Builder $query, HookDriver $driver): void
    {
        $query->where('driver', $driver->value);
    }

    /**
     * Makes the program's selection row when none exists yet; two requests that make it at once leave one row.
     */
    private static function makeIfAbsent(HookDriver $driver): void
    {
        $selection = new self();
        $selection->id = strtolower((string) Str::ulid());
        $selection->driver = $driver->value;
        $selection->has_selected = false;
        $selection->change_number = 0;
        $selection->insertIfAbsent();
    }
}

<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Agents\Enums\StartUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Links\Support\Linkable;
use App\Profiles\Models\Support\AccountOwnerScope;
use App\Programs\Enums\HookProgram;
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
 * @property string $program
 * @property string|null $account_id
 * @property bool $has_selected
 * @property int $change_number
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['program'])]
final class ActiveAccount extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

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
    public static function lockedFor(HookProgram $program): self
    {
        $now = Carbon::now();
        self::query()->insertOrIgnore([
            'id' => (string) Str::ulid(),
            'program' => $program->value,
            'has_selected' => false,
            'change_number' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return self::query()->ofProgram($program)->lockForUpdate()->firstOrFail();
    }

    /**
     * The account the program's starts use, with the selection and then the account locked for the start's
     * transaction; the start path's own read, which no request's actor limits.
     *
     * @throws AccountUnavailable
     */
    public static function lockedAccountForStart(HookProgram $program): Account
    {
        $selection = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofProgram($program)
            ->lockForUpdate()
            ->first();

        if ($selection === null || $selection->account_id === null) {
            throw AccountUnavailable::forStart($program->value, StartUnavailableReason::NoAccount);
        }

        return Account::lockedForStart($selection->account_id);
    }

    /**
     * The program's selection row for the journal's own maintenance or the host, made when first needed and locked;
     * whoever acts.
     */
    public static function lockedForJournal(HookProgram $program): self
    {
        $now = Carbon::now();
        self::query()->withoutGlobalScope(AccountOwnerScope::class)->insertOrIgnore([
            'id' => (string) Str::ulid(),
            'program' => $program->value,
            'has_selected' => false,
            'change_number' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofProgram($program)
            ->lockForUpdate()
            ->firstOrFail();
    }

    /**
     * Each program's current choice, one row per program made so far.
     *
     * @return list<self>
     */
    public static function listed(): array
    {
        return array_values(self::query()->orderBy('program')->readAll('one row per program')->get()->all());
    }

    // ----------[ Mutations ]----------

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
        $this->save();

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
    protected function ofProgram(Builder $query, HookProgram $program): void
    {
        $query->where('program', $program->value);
    }
}

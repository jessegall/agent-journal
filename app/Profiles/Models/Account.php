<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Agents\Enums\LaunchUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Links\Support\Linkable;
use App\Profiles\Enums\AccountState;
use App\Profiles\Exceptions\AccountLabelTaken;
use App\Profiles\Exceptions\AccountMissing;
use App\Profiles\Values\AccountLabel;
use App\Programs\Enums\HookProgram;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One saved Claude Code or Codex account: its program, the name its owner gave it, its state and the private folder
 * its program keeps the sign-in in. Exactly one sign-in process may write that folder at a time; each new writer,
 * replacement and removal starts a new sign-in generation, and anything that reports on the account carries the
 * generation it saw. A removed account keeps its row and label for the launches that used it.
 *
 * @property string $id
 * @property string $program
 * @property string $label
 * @property string $label_key
 * @property AccountState $state
 * @property string|null $directory
 * @property string|null $identity
 * @property bool $maintenance
 * @property int $sign_in_generation
 * @property string|null $live_writer_attempt_id
 * @property string|null $operation_id
 * @property bool $cleanup_pending
 * @property CarbonImmutable|null $checked_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['program', 'label'])]
final class Account extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.account';

    /**
     * @var list<string>
     */
    protected $hidden = ['directory', 'live_writer_attempt_id', 'operation_id'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => AccountState::class,
            'maintenance' => 'boolean',
            'sign_in_generation' => 'integer',
            'cleanup_pending' => 'boolean',
            'checked_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new account a completed sign-in made, signed in, in the folder that sign-in wrote; it starts the account's
     * first sign-in generation.
     */
    public static function signedIn(HookProgram $program, AccountLabel $label, string $directory): self
    {
        $account = new self(['program' => $program->value]);
        $account->name($label);
        $account->state = AccountState::SignedIn;
        $account->directory = $directory;
        $account->sign_in_generation = 1;
        $account->save();

        return $account;
    }

    /**
     * The account the owner may change, locked for the rest of the transaction; a removed account keeps its name for
     * history and is never changed again.
     *
     * @throws AccountMissing
     */
    public static function lockedForChange(string $accountId): self
    {
        $account = self::query()->whereKey($accountId)->lockForUpdate()->first();

        if ($account === null || $account->state === AccountState::Removed) {
            throw AccountMissing::for($accountId);
        }

        return $account;
    }

    /**
     * The owner's accounts that are not removed, by program and name.
     *
     * @return list<self>
     */
    public static function listed(): array
    {
        $accounts = self::query()
            ->where('state', '<>', AccountState::Removed->value)
            ->orderBy('program')
            ->orderBy('label_key')
            ->readAll('the owner sees every saved account at once')
            ->get();

        return array_values($accounts->all());
    }

    /**
     * The program of the account the owner may change, read before its locks are taken in their order.
     *
     * @throws AccountMissing
     */
    public static function programOf(string $accountId): HookProgram
    {
        $program = self::query()->whereKey($accountId)->value('program');

        if (! is_string($program)) {
            throw AccountMissing::for($accountId);
        }

        return HookProgram::from($program);
    }

    /**
     * Gives the account a new name, which no other account of its program in use may share, ignoring case.
     *
     * @throws AccountLabelTaken
     */
    public function rename(AccountLabel $label): void
    {
        $taken = self::query()
            ->where('program', $this->program)
            ->where('label_key', $label->key())
            ->where('state', '<>', AccountState::Removed->value)
            ->whereKeyNot($this->id)
            ->exists();

        if ($taken) {
            throw AccountLabelTaken::for($this->program, $label->label);
        }

        $this->name($label);
        $this->save();
    }

    public function recordIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    /**
     * Refuses a launch on an account that is not signed in or is held for maintenance.
     *
     * @throws AccountUnavailable
     */
    public function requireAvailable(): void
    {
        if (! $this->state->acceptsLaunches() || $this->maintenance) {
            throw AccountUnavailable::forLaunch($this->program, $this->state->launchUnavailableReason());
        }
    }

    /**
     * The folder a launch runs the program's sign-in from; a removed account has none.
     *
     * @throws AccountUnavailable
     */
    public function directoryForLaunch(): string
    {
        if ($this->directory === null) {
            throw AccountUnavailable::forLaunch($this->program, LaunchUnavailableReason::NoAccount);
        }

        return $this->directory;
    }

    /**
     * The one attempt allowed to write this account's folder: the given attempt when none holds it, which starts a new
     * sign-in generation, or the attempt that already does, which a second start rejoins.
     */
    public function writerFor(SignInAttempt $attempt): string
    {
        if ($this->live_writer_attempt_id !== null) {
            return $this->live_writer_attempt_id;
        }

        $this->live_writer_attempt_id = $attempt->id;
        $this->sign_in_generation++;
        $this->save();

        return $attempt->id;
    }

    /**
     * Lets the attempt's writer go when it holds the folder; another attempt's hold is left as it is.
     */
    public function releaseWriter(SignInAttempt $attempt): void
    {
        if ($this->live_writer_attempt_id !== $attempt->id) {
            return;
        }

        $this->live_writer_attempt_id = null;
        $this->save();
    }

    /**
     * Whether a report or a check made in this sign-in generation still speaks for the account.
     */
    public function isGeneration(int $generation): bool
    {
        return $this->sign_in_generation === $generation;
    }

    /**
     * Holds the account for removal: no new launch starts on it and every older report is out of date.
     */
    public function beginRemoval(): void
    {
        $this->state = AccountState::Removing;
        $this->maintenance = true;
        $this->cleanup_pending = true;
        $this->sign_in_generation++;
        $this->save();
    }

    /**
     * Ends the removal once the processes are gone and the program's store and folder are deleted; the row and its
     * label stay for history.
     */
    public function finishRemoval(): void
    {
        $this->state = AccountState::Removed;
        $this->directory = null;
        $this->maintenance = false;
        $this->cleanup_pending = false;
        $this->live_writer_attempt_id = null;
        $this->save();
    }

    private function name(AccountLabel $label): void
    {
        $this->label = $label->label;
        $this->label_key = $label->key();
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProgram(Builder $query, HookProgram $program): void
    {
        $query->where('program', $program->value);
    }
}

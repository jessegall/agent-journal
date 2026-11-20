<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Agents\Enums\StartUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Support\SelectedAccount;
use App\Links\Support\Linkable;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\CleanupProblem;
use App\Profiles\Exceptions\AccountLabelTaken;
use App\Profiles\Exceptions\AccountMissing;
use App\Profiles\Models\Support\AccountOwnerScope;
use App\Profiles\Values\AccountLabel;
use App\Profiles\Values\CleanupProgress;
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
use Illuminate\Support\Str;

/**
 * One saved Claude Code or Codex account: its program, the name its owner gave it, its state and the private folder
 * its program keeps the sign-in in. Exactly one sign-in process may write that folder at a time; each new writer,
 * replacement and removal starts a new sign-in generation, and anything that reports on the account carries the
 * generation it saw. A removed account keeps its row and label for the starts that used it.
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
 * @property bool $cleanup_released
 * @property bool $store_removed
 * @property int $cleanup_tries
 * @property CleanupProblem|null $cleanup_problem
 * @property int|null $check_requested_generation
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
            'cleanup_released' => 'boolean',
            'store_removed' => 'boolean',
            'cleanup_tries' => 'integer',
            'cleanup_problem' => CleanupProblem::class,
            'check_requested_generation' => 'integer',
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
     * The chosen account, locked for a start and refused unless it accepts starts; the start path's own read,
     * which no request's actor limits.
     *
     * @throws AccountUnavailable
     */
    public static function lockedForStart(string $accountId): self
    {
        $account = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->whereKey($accountId)
            ->lockForUpdate()
            ->firstOrFail();
        $account->assertAvailable();

        return $account;
    }

    /**
     * The account locked for the journal's own maintenance or the host that signs it in, whoever acts.
     */
    public static function lockedForJournal(string $accountId): self
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->whereKey($accountId)
            ->lockForUpdate()
            ->firstOrFail();
    }

    /**
     * The account signed in by the attempt that holds its folder: signed in, checked now, its writer released. Signed
     * in again, it starts a new sign-in generation, so a report or check from before is out of date, and starts may
     * use it again.
     */
    public function signedInAgain(SignInAttempt $attempt, string|null $identity, CarbonImmutable $checkedAt): void
    {
        if ($this->live_writer_attempt_id === $attempt->id) {
            $this->sign_in_generation++;
            $this->maintenance = false;
            $this->check_requested_generation = null;
        }

        $this->state = AccountState::SignedIn;
        $this->identity = $identity;
        $this->checked_at = $checkedAt;
        $this->save();
        $this->releaseWriter($attempt);
    }

    /**
     * A sign-in again ended without success. A signed-in account stays held until the host checks it in its current
     * generation, as the attempt may have changed its folder; one that needed a sign-in is simply let go. An older
     * attempt's end changes nothing of a newer writer's hold.
     */
    public function endSignInAgain(SignInAttempt $attempt): void
    {
        if ($this->live_writer_attempt_id !== $attempt->id) {
            return;
        }

        $this->live_writer_attempt_id = null;

        if ($this->state === AccountState::SignedIn) {
            $this->check_requested_generation = $this->sign_in_generation;
        } else {
            $this->maintenance = false;
        }

        $this->save();
    }

    /**
     * Asks the host to check the account after a rejected sign-in seen in this generation; a failure from an older
     * generation, such as one from before a new sign-in, asks nothing.
     */
    public function requestCheck(int $generation): bool
    {
        if (! $this->isGeneration($generation) || $this->state !== AccountState::SignedIn) {
            return false;
        }

        $this->check_requested_generation = $generation;
        $this->save();

        return true;
    }

    /**
     * The next account whose check a host runs, for the journal's host transport whoever acts; none when none waits.
     */
    public static function nextToCheck(): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->whereNotNull('check_requested_generation')
            ->orderBy('updated_at')
            ->lockForUpdate()
            ->first();
    }

    /**
     * Applies the host's check made in the given generation, and answers whether it showed the account signed out;
     * a check of an older generation changes nothing, only a definite sign-out needs a new sign-in, and an account
     * held for its check after a sign-in again stays held until the answer is certain.
     */
    public function applyCheck(int $generation, AccountCheckResult $result, CarbonImmutable $now): bool
    {
        if (! $this->isGeneration($generation)) {
            return false;
        }

        $isHeldForCheck = $this->isHeldForCheck();

        if ($isHeldForCheck && $result === AccountCheckResult::Unknown) {
            return false;
        }

        if ($isHeldForCheck) {
            $this->maintenance = false;
        }

        $this->check_requested_generation = null;
        $this->checked_at = $now;
        $isSignedOut = $result === AccountCheckResult::SignedOut && $this->state === AccountState::SignedIn;

        if ($isSignedOut) {
            $this->state = AccountState::NeedsSignIn;
        }

        $this->save();

        return $isSignedOut;
    }

    /**
     * The account as the start it is chosen for runs with it.
     */
    public function selectedForStart(): SelectedAccount
    {
        return new SelectedAccount(
            $this->recordIdentity(),
            $this->program,
            $this->directoryForStart(),
            $this->sign_in_generation,
        );
    }

    /**
     * The program of an account, for the journal's own maintenance or the host, read before its locks are taken.
     */
    public static function programForJournal(string $accountId): HookProgram
    {
        $program = self::query()->withoutGlobalScope(AccountOwnerScope::class)->whereKey($accountId)->value('program');

        return HookProgram::from((string) $program);
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
     * Refuses a start on an account that is not signed in or is held for maintenance.
     *
     * @throws AccountUnavailable
     */
    public function assertAvailable(): void
    {
        if (! $this->state->canStart() || $this->maintenance) {
            throw AccountUnavailable::forStart($this->program, $this->state->startUnavailableReason());
        }
    }

    /**
     * The folder a start runs the program's sign-in from; a removed account has none.
     *
     * @throws AccountUnavailable
     */
    public function directoryForStart(): string
    {
        if ($this->directory === null) {
            throw AccountUnavailable::forStart($this->program, StartUnavailableReason::NoAccount);
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
     * Holds the account so no new start or claim may use it while its sign-in is changed or removed; holding it
     * again changes nothing.
     */
    public function holdForMaintenance(): void
    {
        if ($this->maintenance) {
            return;
        }

        $this->maintenance = true;
        $this->save();
    }

    /**
     * Whether starts wait for the host's check after a sign-in again that did not finish: only a certain answer
     * lets them go.
     */
    public function isHeldForCheck(): bool
    {
        return $this->maintenance
            && $this->live_writer_attempt_id === null
            && $this->state === AccountState::SignedIn
            && $this->check_requested_generation !== null;
    }

    public function hasLiveWriter(): bool
    {
        return $this->live_writer_attempt_id !== null;
    }

    /**
     * Holds the account for removal as one operation: no new start starts on it, no writer holds its folder and
     * every older report, check or cancellation is out of date.
     */
    public function beginRemoval(): void
    {
        $this->state = AccountState::Removing;
        $this->maintenance = true;
        $this->cleanup_pending = true;
        $this->cleanup_released = false;
        $this->store_removed = false;
        $this->live_writer_attempt_id = null;
        $this->check_requested_generation = null;
        $this->operation_id = strtolower((string) Str::ulid());
        $this->sign_in_generation++;
        $this->save();
    }

    /**
     * The owner asks for the cleanup again after its tries ran out; it still waits for the account's processes and
     * keeps its generation, so nothing newer is cleaned.
     */
    public function retryCleanup(): void
    {
        if ($this->state !== AccountState::Removing) {
            return;
        }

        $this->cleanup_tries = 0;
        $this->save();
    }

    /**
     * Whether the host stopped trying the cleanup on its own and waits for the owner's Retry.
     */
    public function awaitsCleanupRetry(): bool
    {
        return $this->state === AccountState::Removing && $this->cleanup_tries >= CleanupProgress::MOST_TRIES;
    }

    public function isBeingRemoved(): bool
    {
        return in_array($this->state, [AccountState::Removing, AccountState::Removed], true);
    }

    /**
     * Every process on the account ended: a host may now sign it out and delete its folder.
     */
    public function releaseCleanup(): void
    {
        $this->cleanup_released = true;
        $this->save();
    }

    /**
     * Applies what a host proved of the cleanup made in the given generation: the store's proof is kept even when the
     * folder is not yet gone, and the removal ends only with both. A report of another generation changes nothing.
     */
    public function applyCleanup(int $generation, CleanupProgress $progress): bool
    {
        if (! $this->isGeneration($generation) || $this->state !== AccountState::Removing) {
            return false;
        }

        $this->store_removed = $this->store_removed || $progress->isStoreRemoved;

        if (! $this->store_removed || ! $progress->isDirectoryRemoved) {
            $this->cleanup_tries++;
            $this->cleanup_problem = CleanupProblem::of($this->store_removed);
            $this->save();

            return false;
        }

        $this->cleanup_problem = null;
        $this->finishRemoval();

        return true;
    }

    /**
     * The removed accounts whose processes are all gone and whose sign-in or folder a host has still to clean.
     */
    public static function nextToClean(): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->where('state', AccountState::Removing->value)
            ->where('cleanup_released', true)
            ->where('cleanup_tries', '<', CleanupProgress::MOST_TRIES)
            ->whereNotNull('directory')
            ->orderBy('updated_at')
            ->first();
    }

    /**
     * The accounts being removed that still wait for their processes to end.
     *
     * @return list<string>
     */
    public static function waitingForCleanupIds(int $limit): array
    {
        $ids = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->where('state', AccountState::Removing->value)
            ->where('cleanup_released', false)
            ->orderBy('updated_at')
            ->readLimit($limit)
            ->pluck('id');

        return array_values(array_map(strval(...), $ids->all()));
    }

    /**
     * Ends the removal once the processes are gone and the program's store and folder are deleted; the row, its link
     * and its label stay for history.
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

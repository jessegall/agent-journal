<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Agents\Enums\LaunchUnavailableReason;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Support\SelectedAccount;
use App\Links\Support\Linkable;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\AccountState;
use App\Profiles\Exceptions\AccountLabelTaken;
use App\Profiles\Exceptions\AccountMissing;
use App\Profiles\Models\Support\HumanAccounts;
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
     * The chosen account, locked for a launch and refused unless it accepts launches; the launch path's own read,
     * which no request's actor limits.
     *
     * @throws AccountUnavailable
     */
    public static function lockedForLaunch(string $accountId): self
    {
        $account = self::query()
            ->withoutGlobalScope(HumanAccounts::class)
            ->whereKey($accountId)
            ->lockForUpdate()
            ->firstOrFail();
        $account->requireAvailable();

        return $account;
    }

    /**
     * The account locked for the journal's own maintenance or the host that signs it in, whoever acts.
     */
    public static function lockedForJournal(string $accountId): self
    {
        return self::query()
            ->withoutGlobalScope(HumanAccounts::class)
            ->whereKey($accountId)
            ->lockForUpdate()
            ->firstOrFail();
    }

    /**
     * The account signed in by the attempt that holds its folder: signed in, checked now, its writer released. Signed
     * in again, it starts a new sign-in generation, so a report or check from before is out of date, and launches may
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
            ->withoutGlobalScope(HumanAccounts::class)
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
     * The account as the launch it is chosen for runs with it.
     */
    public function selectedForLaunch(): SelectedAccount
    {
        return new SelectedAccount(
            $this->recordIdentity(),
            $this->program,
            $this->directoryForLaunch(),
            $this->sign_in_generation,
        );
    }

    /**
     * The program of an account, for the journal's own maintenance or the host, read before its locks are taken.
     */
    public static function programOfForJournal(string $accountId): HookProgram
    {
        $program = self::query()->withoutGlobalScope(HumanAccounts::class)->whereKey($accountId)->value('program');

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
     * Holds the account so no new launch or claim may use it while its sign-in is changed or removed; holding it
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
     * Whether launches wait for the host's check after a sign-in again that did not finish: only a certain answer
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

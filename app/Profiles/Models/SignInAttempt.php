<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Models\Support\HasActorColumns;
use App\Actors\Support\ActorIdentity;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\CleanupProblem;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Enums\SignInState;
use App\Profiles\Enums\SignInType;
use App\Profiles\Events\SignInAttemptCleanupRetried;
use App\Profiles\Events\SignInAttemptFinished;
use App\Profiles\Events\SignInAttemptReleased;
use App\Profiles\Events\SignInAttemptStarted;
use App\Profiles\Exceptions\SignInAttemptMissing;
use App\Profiles\Models\Support\AccountOwnerScope;
use App\Profiles\Models\Support\KeepsCleanupTries;
use App\Profiles\Values\CleanupProgress;
use App\Programs\Enums\HookProgram;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * One run of a program's own sign-in: for a new account, or to sign an existing one in again. Its private folder,
 * process and login references never leave the server, and no challenge, code or token is ever kept on it. A finished
 * attempt may still owe the deletion of what it left behind.
 *
 * @property string $id
 * @property string $program
 * @property string|null $account_id
 * @property SignInMethod $method
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property string|null $fingerprint
 * @property SignInState $state
 * @property string $request_key
 * @property int $generation
 * @property string|null $directory
 * @property string|null $process_reference
 * @property string|null $login_reference
 * @property bool $cleanup_pending
 * @property bool $waits_for_uses
 * @property bool $store_removed
 * @property int $cleanup_tries
 * @property CleanupProblem|null $cleanup_problem
 * @property string|null $refusal
 * @property CarbonImmutable $expires_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Account|null $account
 */
#[Fillable(['program', 'method', 'actor_type', 'actor_id'])]
final class SignInAttempt extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use KeepsCleanupTries;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'core.sign-in-attempt';

    /**
     * @var list<string>
     */
    protected $hidden = ['directory', 'process_reference', 'login_reference', 'request_key'];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'method' => SignInMethod::class,
            'actor_type' => ActorType::class,
            'state' => SignInState::class,
            'generation' => 'integer',
            'cleanup_pending' => 'boolean',
            'waits_for_uses' => 'boolean',
            'store_removed' => 'boolean',
            'cleanup_tries' => 'integer',
            'cleanup_problem' => CleanupProblem::class,
            'expires_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new attempt, started by an actor, to sign in by a method into its own new staging folder: a new account of a
     * program, or an existing account again, in the sign-in generation that account is in. No host takes a sign-in
     * again while a process may still run on the account's folder.
     */
    public static function create(
        ActorIdentity $starter,
        Account|HookProgram $accountOrProgram,
        SignInMethod $method,
        string $directory,
        string $requestKey,
        CarbonImmutable $expiresAt,
    ): self {
        $attempt = new self([
            'program' => $accountOrProgram instanceof Account ? $accountOrProgram->program : $accountOrProgram->value,
            'method' => $method,
            ...$starter->asColumns('actor'),
        ]);

        if ($accountOrProgram instanceof Account) {
            $attempt->account_id = $accountOrProgram->id;
            $attempt->generation = $accountOrProgram->sign_in_generation;
            $attempt->waits_for_uses = true;
        }

        $attempt->directory = $directory;
        $attempt->begin($requestKey, $expiresAt);

        return $attempt;
    }

    /**
     * The oldest attempt no host runs yet, taken by this host to run its program's sign-in; none when nothing waits.
     */
    public static function claimFor(string $hostId, CarbonImmutable $now): self|null
    {
        $attempt = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->where('state', SignInState::Starting->value)
            ->where('waits_for_uses', false)
            ->whereNull('process_reference')
            ->where('expires_at', '>', $now)
            ->orderBy('created_at')
            ->lockForUpdate()
            ->first();

        if ($attempt === null) {
            return null;
        }

        $attempt->process_reference = $hostId;
        $attempt->save();

        return $attempt;
    }

    // ----------[ Queries ]----------

    /**
     * A new, unused staging folder under the accounts root, one for every attempt.
     */
    public static function newFolderIn(string $root): string
    {
        return $root.'/'.Str::lower((string) Str::ulid());
    }

    /**
     * The earliest attempt still signing in a new account of the program, or this account, which a second start
     * rejoins instead of starting another writer.
     */
    public static function liveFor(HookProgram $program, Account|null $account): self|null
    {
        return self::query()
            ->ofProgram($program)
            ->where('account_id', $account?->id)
            ->whereIn('state', array_map(fn (SignInState $state) => $state->value, SignInState::live()))
            ->orderBy('created_at')
            ->orderBy('id')
            ->lockForUpdate()
            ->first();
    }

    /**
     * The attempt a repeated start with the same request key made, so a retried click rejoins it.
     */
    public static function withRequestKey(string $requestKey): self|null
    {
        return self::query()->where('request_key', $requestKey)->lockForUpdate()->first();
    }

    /**
     * The owner's attempt, locked.
     *
     * @throws SignInAttemptMissing
     */
    public static function lockedForOwner(string $attemptId): self
    {
        return self::found($attemptId, self::query()->whereKey($attemptId)->lockForUpdate()->first());
    }

    /**
     * The attempt locked for the journal's own maintenance or the host that runs its sign-in, whoever acts.
     *
     * @throws SignInAttemptMissing
     */
    public static function lockedForJournal(string $attemptId): self
    {
        $attempt = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->whereKey($attemptId)
            ->lockForUpdate()
            ->first();

        return self::found($attemptId, $attempt);
    }

    /**
     * The program of an attempt, read before its locks are taken in their order: selection, then attempt.
     *
     * @throws SignInAttemptMissing
     */
    public static function programForJournal(string $attemptId): HookProgram
    {
        $program = self::query()->withoutGlobalScope(AccountOwnerScope::class)->whereKey($attemptId)->value('program');

        if (! is_string($program)) {
            throw SignInAttemptMissing::for($attemptId);
        }

        return HookProgram::from($program);
    }

    /**
     * The live attempts whose deadline has passed, oldest first, for the reconciliation sweep.
     *
     * @return list<string>
     */
    public static function expiredLiveIds(CarbonImmutable $now, int $limit): array
    {
        $ids = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->whereIn('state', array_map(fn (SignInState $state) => $state->value, SignInState::live()))
            ->where('expires_at', '<=', $now)
            ->orderBy('expires_at')
            ->readExactly($limit)
            ->pluck('id');

        return array_values(array_map(strval(...), $ids->all()));
    }

    /**
     * The owner's sign-ins that still run or ended within the last quarter hour, newest first, so a failure stays
     * visible for a while.
     *
     * @return list<self>
     */
    public static function recentFor(CarbonImmutable $now): array
    {
        $attempts = self::query()
            ->where(fn (Builder $recent) => $recent
                ->whereIn('state', array_map(fn (SignInState $state) => $state->value, SignInState::live()))
                ->orWhere('updated_at', '>=', $now->subMinutes(15)))
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return array_values($attempts->all());
    }

    /**
     * The live attempts the host took that it says it no longer runs, locked; another host's attempts are left alone.
     *
     * @param  list<string>  $runningAttemptIds
     * @return list<self>
     */
    public static function lostBy(string $hostId, array $runningAttemptIds): array
    {
        $attempts = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->where('process_reference', $hostId)
            ->whereIn('state', array_map(fn (SignInState $state) => $state->value, SignInState::live()))
            ->whereNotIn('id', $runningAttemptIds)
            ->orderBy('created_at')
            ->lockForUpdate()
            ->readAll('a host reconciles the few sign-ins it took')
            ->get();

        return array_values($attempts->all());
    }

    /**
     * The attempt this host runs, read before its locks are taken in their order; another host's attempt is as unknown
     * as a missing one.
     *
     * @throws SignInAttemptMissing
     */
    public static function runBy(string $hostId, string $attemptId): self
    {
        $attempt = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->whereKey($attemptId)
            ->where('process_reference', $hostId)
            ->first();

        return self::found($attemptId, $attempt);
    }

    /**
     * The ended attempt whose staging folder a host has still to clean, for a new account or a reconnect alike; a
     * reconnect never touched the account's saved folder, so only its own staging folder is cleaned.
     */
    public static function nextToClean(): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->where('cleanup_pending', true)
            ->where('cleanup_tries', '<', CleanupProgress::MOST_TRIES)
            ->whereNotNull('directory')
            ->whereNotExists(fn ($accounts) => $accounts->from('accounts')
                ->whereColumn('accounts.directory', 'sign_in_attempts.directory')
                ->where('accounts.state', '!=', AccountState::Removed->value))
            ->whereNotIn('state', array_map(fn (SignInState $state) => $state->value, SignInState::live()))
            ->orderBy('updated_at')
            ->first();
    }

    /**
     * The owner's unfinished sign-ins whose staging folder still waits for its cleanup, oldest first.
     *
     * @return list<self>
     */
    public static function pendingCleanups(): array
    {
        $attempts = self::query()
            ->where('cleanup_pending', true)
            ->whereNotIn('state', array_map(fn (SignInState $state) => $state->value, SignInState::live()))
            ->orderBy('created_at')
            ->limit(50)
            ->get();

        return array_values($attempts->all());
    }

    /**
     * The live attempts to sign an account in again that still wait for the account's processes to end.
     *
     * @return list<string>
     */
    public static function waitingForUsesIds(int $limit): array
    {
        $ids = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->where('waits_for_uses', true)
            ->whereIn('state', array_map(fn (SignInState $state) => $state->value, SignInState::live()))
            ->orderBy('created_at')
            ->readExactly($limit)
            ->pluck('id');

        return array_values(array_map(strval(...), $ids->all()));
    }

    // ----------[ Mutations ]----------

    /**
     * A completed reconnect hands the account its staging folder and keeps the folder it displaced, owing that
     * folder's cleanup, in the same transaction.
     */
    public function displace(string $savedDirectory): void
    {
        $this->state = SignInState::Complete;
        $this->directory = $savedDirectory;
        $this->cleanup_pending = true;
        $this->save();
    }

    /**
     * Keeps the keyed fingerprint of the key or token the owner gave, never the value itself.
     */
    public function keepFingerprint(string $fingerprint): void
    {
        $this->fingerprint = $fingerprint;
        $this->save();
    }

    /**
     * Ends a live attempt in the given state; an attempt that made no account still owes the deletion of its folder.
     */
    public function end(SignInState $state): void
    {
        $this->state = $state;
        $this->cleanup_pending = $state !== SignInState::Complete;
        $this->assertSaved($this->save());
    }

    /**
     * The program's sign-in started and now waits for its user; only from here may a verified result complete it.
     */
    public function waitForUser(): void
    {
        if ($this->state !== SignInState::Starting) {
            return;
        }

        $this->state = SignInState::Waiting;
        $this->save();
    }

    /**
     * The user's code, key or token went to the program, which now checks it; the attempt ends when the check does.
     */
    public function startChecking(): void
    {
        if ($this->state !== SignInState::Starting && $this->state !== SignInState::Waiting) {
            return;
        }

        $this->state = SignInState::Checking;
        $this->save();
    }

    /**
     * Takes the account's folder as its one writer and runs in the sign-in generation that starts.
     */
    public function writeFolderOf(Account $account): void
    {
        $account->writerFor($this);
        $this->generation = $account->sign_in_generation;
        $this->save();
    }

    /**
     * Applies what a host proved of the attempt's cleanup: its store's proof is kept, and the cleanup ends only once
     * the folder is gone too: its own staging folder, or the folder a completed reconnect displaced.
     */
    public function applyCleanup(CleanupProgress $progress): bool
    {
        if (! $this->cleanup_pending) {
            return false;
        }

        if ($this->recordCleanupTry($progress)) {
            $this->cleanup_pending = false;
            $this->directory = null;
        }

        $this->save();

        return ! $this->cleanup_pending;
    }

    /**
     * The owner asks for the cleanup of an unfinished sign-in's staging folder again, by the attempt alone, even when
     * its folder is already gone: the host still has to show the program's sign-in is gone.
     */
    public function retryCleanup(): void
    {
        if (! $this->cleanup_pending) {
            return;
        }

        $this->resetCleanupTries();
        $this->raise(new SignInAttemptCleanupRetried($this->program, $this->id));
    }

    /**
     * Every process on the account's folder ended: a host may now take the attempt.
     */
    public function releaseForHost(): void
    {
        $this->waits_for_uses = false;
        $this->assertSaved($this->save());
        $this->raise(new SignInAttemptReleased($this->program, $this->id, $this->account_id));
    }

    // ----------[ Answers ]----------

    /**
     * Whether the completion itself already ended the attempt in this generation, so a repeated report of the same
     * result changes nothing.
     */
    public function isPublishedIn(int $generation): bool
    {
        $published = [SignInState::Complete, SignInState::DifferentAccount, SignInState::AlreadyAdded];

        return in_array($this->state, $published, true) && $this->generation === $generation;
    }

    public function type(): SignInType
    {
        return $this->account_id === null ? SignInType::NewAccount : SignInType::SignInAgain;
    }

    public function isLive(): bool
    {
        return $this->state->isLive();
    }

    public function isExpiredAt(CarbonImmutable $now): bool
    {
        return $this->expires_at <= $now;
    }

    /**
     * The proof failed: the attempt ends failed, keeping the provider's reason when it refused the proof.
     */
    public function fail(string|null $refusal): void
    {
        $this->refusal = $refusal;
        $this->finish(SignInState::Failed);
    }

    /**
     * Ends the attempt and lets go of the account folder it wrote, so a later attempt may write it; an account signed
     * in again that may have changed is checked before starts use it again.
     */
    public function finish(SignInState $state): void
    {
        $this->end($state);
        $this->raise(new SignInAttemptFinished($this->program, $this->id, $this->account_id));
    }

    public function awaitsCleanupRetry(): bool
    {
        return $this->cleanup_pending && $this->hasUsedEveryCleanupTry();
    }

    /**
     * Whether a sign-in result the host reports still speaks for this attempt: it is live, within its deadline, and
     * made in the attempt's sign-in generation.
     */
    public function accepts(int $generation, CarbonImmutable $now): bool
    {
        return $this->state->canComplete() && ! $this->isExpiredAt($now) && $this->generation === $generation;
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Account, $this>
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    // ----------[ Internals ]----------

    /**
     * @throws SignInAttemptMissing
     */
    private static function found(string $attemptId, self|null $attempt): self
    {
        if ($attempt === null) {
            throw SignInAttemptMissing::for($attemptId);
        }

        return $attempt;
    }

    private function begin(string $requestKey, CarbonImmutable $expiresAt): void
    {
        $this->state = SignInState::Starting;
        $this->request_key = $requestKey;
        $this->expires_at = $expiresAt;
        $this->assertSaved($this->save());
        $this->raise(new SignInAttemptStarted($this->program, $this->id, $this->account_id));
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

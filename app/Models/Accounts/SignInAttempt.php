<?php

declare(strict_types=1);

namespace App\Models\Accounts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\AccountState;
use App\Enums\ActorType;
use App\Enums\CleanupProblem;
use App\Enums\SignInMethod;
use App\Enums\SignInState;
use App\Enums\SignInType;
use App\Events\Accounts\SignInAttemptAnswerAccepted;
use App\Events\Accounts\SignInAttemptClaimed;
use App\Events\Accounts\SignInAttemptCleanupApplied;
use App\Events\Accounts\SignInAttemptCleanupRetried;
use App\Events\Accounts\SignInAttemptDisplaced;
use App\Events\Accounts\SignInAttemptEnded;
use App\Events\Accounts\SignInAttemptFingerprinted;
use App\Events\Accounts\SignInAttemptFinished;
use App\Events\Accounts\SignInAttemptGenerationSet;
use App\Events\Accounts\SignInAttemptHandedToUser;
use App\Events\Accounts\SignInAttemptReleased;
use App\Events\Accounts\SignInAttemptStarted;
use App\Exceptions\SignInAnswerRefused;
use App\Exceptions\SignInAttemptMissing;
use App\Models\Support\AccountOwnerScope;
use App\Models\Support\HasActorColumns;
use App\Models\Support\KeepsCleanupTries;
use App\Support\ActorIdentity;
use App\Values\CleanupProgress;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * One run of a driver's own sign-in: for a new account, or to sign an existing one in again. Its private folder,
 * process and login references never leave the server, and no challenge, code or token is ever kept on it. A finished
 * attempt may still owe the deletion of what it left behind.
 *
 * @property string $id
 * @property string $account_protocol the account provider's protocol, which every driver of one family shares
 * @property string|null $account_id
 * @property string|null $result_account_id
 * @property SignInMethod $method
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property string|null $fingerprint
 * @property string|null $submission_key
 * @property SignInState $state
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
 * @property-read Account|null $resultAccount
 */
#[Fillable(['account_protocol', 'method', 'actor_type', 'actor_id'])]
final class SignInAttempt extends Model implements EventSource, ReadableModel
{
    /**
     * How long an attempt may wait for a sign-in service to take it up before the dialog says none has.
     */
    public const int UNCLAIMED_SECONDS = 20;

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
    protected $hidden = ['directory', 'process_reference', 'login_reference', 'submission_key'];

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
     * driver, or an existing account again, in the sign-in generation that account is in. No host takes a sign-in
     * again while a process may still run on the account's folder.
     */
    public static function create(
        ActorIdentity $starter,
        Account|string $accountOrDriver,
        SignInMethod $method,
        string $directory,
        CarbonImmutable $expiresAt,
    ): self {
        $attempt = new self([
            'account_protocol' => $accountOrDriver instanceof Account
                ? $accountOrDriver->account_protocol
                : $accountOrDriver,
            'method' => $method,
            'actor_type' => $starter->type->value,
            'actor_id' => $starter->id,
        ]);

        if ($accountOrDriver instanceof Account) {
            $attempt->account_id = $accountOrDriver->id;
            $attempt->generation = $accountOrDriver->sign_in_generation;
            $attempt->waits_for_uses = true;
        }

        $attempt->directory = $directory;
        $attempt->begin($expiresAt);

        return $attempt;
    }

    /**
     * The oldest attempt no host runs yet, locked for its claim; none when nothing waits.
     */
    public static function oldestWaitingAt(CarbonImmutable $now): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->where('state', SignInState::Starting->value)
            ->where('waits_for_uses', false)
            ->whereNull('process_reference')
            ->where('expires_at', '>', $now)
            ->orderBy('created_at')
            ->lockForUpdate()
            ->first();
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
     * The earliest attempt still signing in a new account of the driver, or this account, which a second start
     * rejoins instead of starting another writer.
     */
    public static function liveFor(string $driver, Account|null $account): self|null
    {
        return self::query()
            ->ofDriver($driver)
            ->where('account_id', $account?->id)
            ->whereIn('state', array_map(fn (SignInState $state) => $state->value, SignInState::live()))
            ->orderBy('created_at')
            ->orderBy('id')
            ->lockForUpdate()
            ->first();
    }

    /**
     * The attempt, while the owner may read it; none once it is gone or another owner's.
     */
    public static function readableByOwner(string $attemptId): self|null
    {
        return self::query()->whereKey($attemptId)->with('resultAccount')->first();
    }

    /**
     * The owner's attempt, locked.
     *
     * @throws SignInAttemptMissing
     */
    public static function lockedForOwner(string $attemptId): self
    {
        $attempt = self::query()->whereKey($attemptId)->lockForUpdate()->first();
        self::assertFound($attempt, $attemptId);

        return $attempt;
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
        self::assertFound($attempt, $attemptId);

        return $attempt;
    }

    /**
     * The driver of an attempt, read before its locks are taken in their order: selection, then attempt.
     *
     * @throws SignInAttemptMissing
     */
    public static function driverForJournal(string $attemptId): string
    {
        $driver = self::query()->withoutGlobalScope(
            AccountOwnerScope::class,
        )->whereKey($attemptId)->value('account_protocol');
        self::assertDriverFound($driver, $attemptId);

        return $driver;
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
            ->with('resultAccount')
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
        self::assertFound($attempt, $attemptId);

        return $attempt;
    }

    /**
     * The ended attempt whose staging folder a host has still to clean, for a new account or a reconnect alike; a
     * reconnect never touched the account's saved folder, so only its own staging folder is cleaned.
     */
    public static function nextDueForCleanup(): self|null
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
    public function displace(Account $account): void
    {
        $this->state = SignInState::Complete;
        $this->result_account_id = $account->id;
        $this->directory = (string) $account->directory;
        $this->cleanup_pending = true;
        $this->save();
        $this->raise(new SignInAttemptDisplaced($this->account_protocol, $this->id, $account->id));
    }

    /**
     * Keeps the keyed fingerprint of the key or token the owner gave, never the value itself.
     */
    public function keepFingerprint(string $fingerprint): void
    {
        $this->fingerprint = $fingerprint;
        $this->save();
        $this->raise(new SignInAttemptFingerprinted($this->account_protocol, $this->id));
    }

    /**
     * Ends a live attempt in the given state; an attempt that made no account still owes the deletion of its folder.
     */
    public function end(SignInState $state): void
    {
        $this->state = $state;
        $this->cleanup_pending = $state !== SignInState::Complete;
        $this->assertSaved($this->save());
        $this->raise(new SignInAttemptEnded($this->account_protocol, $this->id, $state));
    }

    /**
     * The driver's sign-in started and now waits for its user; only from here may a verified result complete it.
     */
    public function waitForUser(): void
    {
        if ($this->state !== SignInState::Starting) {
            return;
        }

        $this->state = SignInState::Waiting;
        $this->save();
        $this->raise(new SignInAttemptHandedToUser($this->account_protocol, $this->id));
    }

    /**
     * The user's answer, under its request key, went to the driver, which now checks it; the key is the answer's
     * receipt, so a repeat of it is known.
     */
    public function acceptAnswer(string $submissionKey): void
    {
        $this->state = SignInState::Checking;
        $this->submission_key = $submissionKey;
        $this->save();
        $this->raise(new SignInAttemptAnswerAccepted($this->account_protocol, $this->id));
    }

    /**
     * The host takes the attempt to run its driver's sign-in.
     */
    public function claimOn(string $hostId): void
    {
        $this->process_reference = $hostId;
        $this->save();
        $this->raise(new SignInAttemptClaimed($this->account_protocol, $this->id, $hostId));
    }

    /**
     * The attempt writes in the account's sign-in generation it now holds the folder for.
     */
    public function writeInGeneration(int $generation): void
    {
        $this->generation = $generation;
        $this->save();
        $this->raise(new SignInAttemptGenerationSet($this->account_protocol, $this->id, $generation));
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
        $this->raise(new SignInAttemptCleanupApplied($this->account_protocol, $this->id, ! $this->cleanup_pending));

        return ! $this->cleanup_pending;
    }

    /**
     * The owner asks for the cleanup of an unfinished sign-in's staging folder again, by the attempt alone, even when
     * its folder is already gone: the host still has to show the driver's sign-in is gone.
     */
    public function retryCleanup(): void
    {
        if (! $this->cleanup_pending) {
            return;
        }

        $this->resetCleanupTries();
        $this->raise(new SignInAttemptCleanupRetried($this->account_protocol, $this->id));
    }

    /**
     * Every process on the account's folder ended: a host may now take the attempt.
     */
    public function releaseForHost(): void
    {
        $this->waits_for_uses = false;
        $this->assertSaved($this->save());
        $this->raise(new SignInAttemptReleased($this->account_protocol, $this->id, $this->account_id));
    }

    // ----------[ Answers ]----------

    /**
     * Whether a renewal has not started on the host yet because agents still run on the account it renews.
     */
    public function isWaitingForAgents(): bool
    {
        return $this->waits_for_uses && $this->state === SignInState::Starting;
    }

    /**
     * Whether no sign-in service has taken up the attempt this long after it was asked for: the journal's sign-in
     * service is not running or cannot reach the journal.
     */
    public function isUnclaimedSince(CarbonImmutable $now): bool
    {
        return $this->state === SignInState::Starting
            && ! $this->waits_for_uses
            && $this->process_reference === null
            && $this->created_at !== null
            && $this->created_at->addSeconds(self::UNCLAIMED_SECONDS)->lessThanOrEqualTo($now);
    }

    public function isPublishedIn(int $generation): bool
    {
        $published = [
            SignInState::Complete,
            SignInState::DifferentAccount,
            SignInState::AlreadyAdded,
            SignInState::Unverified,
        ];

        return in_array($this->state, $published, true) && $this->generation === $generation;
    }

    /**
     * Whether the answer under this request key is the one the attempt already took.
     */
    public function hasTakenAnswer(string $submissionKey): bool
    {
        return $this->submission_key !== null && hash_equals($this->submission_key, $submissionKey);
    }

    /**
     * @throws SignInAnswerRefused
     */
    public function assertWaitsForAnswer(CarbonImmutable $now): void
    {
        if ($this->state !== SignInState::Waiting || $this->isExpiredAt($now)) {
            throw SignInAnswerRefused::notWaiting($this->id);
        }
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
     * Ends a live attempt in the given state at this moment: an attempt that already ended keeps its result, and one
     * at or past its deadline ends Expired whatever was asked. Answers the state the attempt is in afterwards.
     */
    public function finishAt(SignInState $state, CarbonImmutable $now, string|null $reason = null): SignInState
    {
        if (! $this->isLive()) {
            return $this->state;
        }

        if ($this->isExpiredAt($now)) {
            $this->finish(SignInState::Expired);

            return SignInState::Expired;
        }

        $this->refusal = $reason;
        $this->finish($state);

        return $state;
    }

    /**
     * A new account came of the attempt: it ends complete and names that account as its result.
     */
    public function completeWith(Account $account): void
    {
        $this->result_account_id = $account->id;
        $this->end(SignInState::Complete);
    }

    /**
     * The key or login is one an account already holds: the attempt ends already added and names that account.
     */
    public function finishMatching(Account $account): void
    {
        $this->result_account_id = $account->id;
        $this->finish(SignInState::AlreadyAdded);
    }

    /**
     * Ends the attempt and lets go of the account folder it wrote, so a later attempt may write it; an account signed
     * in again that may have changed is checked before starts use it again.
     */
    public function finish(SignInState $state): void
    {
        $this->end($state);
        $this->raise(new SignInAttemptFinished($this->account_protocol, $this->id, $this->account_id));
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

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<SignInType::NewAccount|SignInType::SignInAgain, never>
     */
    protected function type(): Attribute
    {
        return Attribute::get(
            fn (): SignInType => $this->account_id === null ? SignInType::NewAccount : SignInType::SignInAgain,
        )->withoutObjectCaching();
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Account, $this>
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * The account the attempt made, renewed or matched; read under the reader's own account scope, so a reader who may
     * not read that account finds none.
     *
     * @return BelongsTo<Account, $this>
     */
    public function resultAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'result_account_id');
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an attempt that is not there for the caller.
     *
     * @phpstan-assert self $attempt
     *
     * @throws SignInAttemptMissing
     */
    private static function assertFound(self|null $attempt, string $attemptId): void
    {
        if ($attempt === null) {
            throw SignInAttemptMissing::for($attemptId);
        }
    }

    /**
     * Refuses an attempt whose driver could not be read: the attempt is not there.
     *
     * @phpstan-assert string $driver
     *
     * @throws SignInAttemptMissing
     */
    private static function assertDriverFound(mixed $driver, string $attemptId): void
    {
        if (! is_string($driver)) {
            throw SignInAttemptMissing::for($attemptId);
        }
    }

    // ----------[ Internals ]----------

    private function begin(CarbonImmutable $expiresAt): void
    {
        $this->state = SignInState::Starting;
        $this->expires_at = $expiresAt;
        $this->assertSaved($this->save());
        $this->raise(new SignInAttemptStarted($this->account_protocol, $this->id, $this->account_id));
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
}

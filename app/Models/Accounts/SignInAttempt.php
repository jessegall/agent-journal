<?php

declare(strict_types=1);

namespace App\Models\Accounts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Accounts\AccountStatus;
use App\Enums\Accounts\CleanupProblem;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInStatus;
use App\Enums\Accounts\SignInType;
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
use App\Models\Support\Accessor;
use App\Models\Support\AccountOwnerScope;
use App\Models\Support\HasActorColumns;
use App\Models\Support\JournalModel;
use App\Models\Support\KeepsCleanupTries;
use App\Support\ActorReference;
use App\Values\CleanupProgress;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Str;

/**
 * @property string $id
 * @property string $account_protocol
 * @property SignInMethod $method
 * @property string $actor_type
 * @property string $actor_id
 * @property string|null $fingerprint
 * @property string|null $account_id
 * @property SignInStatus $status
 * @property int $generation
 * @property string|null $directory
 * @property string|null $process_reference
 * @property string|null $login_reference
 * @property bool $cleanup_pending
 * @property bool $waits_for_uses
 * @property bool $store_removed
 * @property int $cleanup_tries
 * @property CleanupProblem|null $cleanup_problem
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property string|null $refusal
 * @property string|null $result_account_id
 * @property string|null $submission_key
 * @property-read Account|null $account
 * @property-read Account|null $resultAccount
 * @property-read mixed $type
 *
 * @mixin \Eloquent
 */
final class SignInAttempt extends JournalModel implements EventSource, ReadableModel
{
    /**
     * How long an attempt may wait for a sign-in service to take it up before the dialog says none has.
     */
    public const int UNCLAIMED_SECONDS = 20;

    use BoundedReads;
    use HasActorColumns;
    use KeepsCleanupTries;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @var list<string>
     */
    protected $hidden = [
        'directory',
        'process_reference',
        'login_reference',
        'submission_key',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'method' => SignInMethod::class,
            'status' => SignInStatus::class,
            'generation' => 'integer',
            'cleanup_pending' => 'boolean',
            'waits_for_uses' => 'boolean',
            'store_removed' => 'boolean',
            'cleanup_tries' => 'integer',
            'cleanup_problem' => CleanupProblem::class,
            'expires_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new attempt, started by an actor, to sign in by a method into its own new staging folder: a new account of a
     * driver, or an existing account again, in the sign-in generation that account is in. No host takes a sign-in
     * again while a process may still run on the account's folder.
     */
    public static function create(
        ActorReference $starter,
        Account|string $accountOrDriver,
        SignInMethod $method,
        string $directory,
        CarbonImmutable $expiresAt,
    ): self {
        $attempt = new self();

        $attempt->account_protocol = $accountOrDriver instanceof Account
            ? $accountOrDriver->account_protocol
            : $accountOrDriver;

        $attempt->method = $method;
        $attempt->actor_type = $starter->type;
        $attempt->actor_id = $starter->id;

        if ($accountOrDriver instanceof Account) {
            $attempt->account_id = $accountOrDriver->id;
            $attempt->generation = $accountOrDriver->sign_in_generation;
            $attempt->waits_for_uses = true;
        }

        $attempt->directory = $directory;
        $attempt->begin($expiresAt);

        return $attempt;
    }

    // ----------[ Mutations ]----------

    /**
     * A completed reconnect hands the account its staging folder and keeps the folder it displaced, owing that
     * folder's cleanup, in the same transaction.
     */
    public function displace(Account $account): void
    {
        $this->status = SignInStatus::Complete;
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
    public function end(SignInStatus $state): void
    {
        $this->status = $state;
        $this->cleanup_pending = $state !== SignInStatus::Complete;
        $this->assertSaved($this->save());
        $this->raise(new SignInAttemptEnded($this->account_protocol, $this->id, $state));
    }

    /**
     * The driver's sign-in started and now waits for its user; only from here may a verified result complete it.
     */
    public function waitForUser(): void
    {
        if ($this->status !== SignInStatus::Starting) {
            return;
        }

        $this->status = SignInStatus::Waiting;
        $this->save();
        $this->raise(new SignInAttemptHandedToUser($this->account_protocol, $this->id));
    }

    /**
     * The user's answer, under its request key, went to the driver, which now checks it; the key is the answer's
     * receipt, so a repeat of it is known.
     */
    public function acceptAnswer(string $submissionKey): void
    {
        $this->status = SignInStatus::Checking;
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

    /**
     * A new account came of the attempt: it ends complete and names that account as its result.
     */
    public function completeWith(Account $account): void
    {
        $this->result_account_id = $account->id;
        $this->end(SignInStatus::Complete);
    }

    /**
     * The key or login is one an account already holds: the attempt ends already added and names that account.
     */
    public function finishMatching(Account $account): void
    {
        $this->result_account_id = $account->id;
        $this->finish(SignInStatus::AlreadyAdded);
    }

    /**
     * Ends the attempt and lets go of the account folder it wrote, so a later attempt may write it; an account signed
     * in again that may have changed is checked before starts use it again.
     */
    public function finish(SignInStatus $state): void
    {
        $this->end($state);
        $this->raise(new SignInAttemptFinished($this->account_protocol, $this->id, $this->account_id));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether a renewal has not started on the host yet because agents still run on the account it renews.
     */
    public function isWaitingForAgents(): bool
    {
        return $this->waits_for_uses && $this->status === SignInStatus::Starting;
    }

    /**
     * Whether no sign-in service has taken up the attempt this long after it was asked for: the journal's sign-in
     * service is not running or cannot reach the journal.
     */
    public function isUnclaimedSince(CarbonImmutable $now): bool
    {
        return $this->status === SignInStatus::Starting
            && ! $this->waits_for_uses
            && $this->process_reference === null
            && $this->created_at !== null
            && $this->created_at->addSeconds(self::UNCLAIMED_SECONDS)->lessThanOrEqualTo($now);
    }

    public function isPublishedIn(int $generation): bool
    {
        $published = [
            SignInStatus::Complete,
            SignInStatus::DifferentAccount,
            SignInStatus::AlreadyAdded,
            SignInStatus::Unverified,
        ];

        return in_array($this->status, $published, true) && $this->generation === $generation;
    }

    /**
     * Whether the answer under this request key is the one the attempt already took.
     */
    public function hasTakenAnswer(string $submissionKey): bool
    {
        return $this->submission_key !== null && hash_equals($this->submission_key, $submissionKey);
    }

    public function isLive(): bool
    {
        return $this->status->isLive();
    }

    public function isExpiredAt(CarbonImmutable $now): bool
    {
        return $this->expires_at <= $now;
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
        return $this->status->canComplete() && ! $this->isExpiredAt($now) && $this->generation === $generation;
    }

    // ----------[ Transformers ]----------

    /**
     * Ends a live attempt in the given state at this moment: an attempt that already ended keeps its result, and one
     * at or past its deadline ends Expired whatever was asked. Answers the state the attempt is in afterwards.
     */
    public function finishAt(SignInStatus $state, CarbonImmutable $now, string|null $reason = null): SignInStatus
    {
        if (! $this->isLive()) {
            return $this->status;
        }

        if ($this->isExpiredAt($now)) {
            $this->finish(SignInStatus::Expired);

            return SignInStatus::Expired;
        }

        $this->refusal = $reason;
        $this->finish($state);

        return $state;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<SignInType::NewAccount|SignInType::SignInAgain, never>
     */
    protected function type(): Attribute
    {
        return Accessor::get(fn () => $this->account_id === null ? SignInType::NewAccount : SignInType::SignInAgain);
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
     * @throws SignInAnswerRefused
     */
    public function assertWaitsForAnswer(CarbonImmutable $now): void
    {
        if ($this->status !== SignInStatus::Waiting || $this->isExpiredAt($now)) {
            throw SignInAnswerRefused::notWaiting($this->id);
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
        $this->status = SignInStatus::Starting;
        $this->expires_at = $expiresAt;
        $this->assertSaved($this->save());
        $this->raise(new SignInAttemptStarted($this->account_protocol, $this->id, $this->account_id));
    }

    // ----------[ Queries ]----------

    /**
     * The oldest attempt no host runs yet, locked for its claim; none when nothing waits.
     */
    public static function findOldestWaitingAt(CarbonImmutable $now): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->waitingToStartAt($now)
            ->oldestFirst()
            ->lockForUpdate()
            ->first();
    }

    /**
     * A new, unused staging folder under the accounts root, one for every attempt.
     */
    public static function resolveNewFolderIn(string $root): string
    {
        return $root.'/'.Str::lower((string) Str::ulid());
    }

    /**
     * The earliest attempt still signing in a new account of the driver, or this account, which a second start
     * rejoins instead of starting another writer.
     */
    public static function findLiveFor(string $driver, Account|null $account): self|null
    {
        return self::query()
            ->ofDriver($driver)
            ->ofAccount($account?->id)
            ->live()
            ->oldestFirst()
            ->lockForUpdate()
            ->first();
    }

    /**
     * The attempt, while the owner may read it; none once it is gone or another owner's.
     */
    public static function findReadableByOwner(string $attemptId): self|null
    {
        return self::query()->whereKey($attemptId)->with('resultAccount')->first();
    }

    /**
     * The owner's attempt, locked.
     *
     * @throws SignInAttemptMissing
     */
    public static function findLockedForOwner(string $attemptId): self
    {
        return self::query()->whereKey($attemptId)->lockForUpdate()->firstOr(
            SignInAttemptMissing::throwing()->for($attemptId),
        );
    }

    /**
     * The attempt locked for the journal's own maintenance or the host that runs its sign-in, whoever acts.
     *
     * @throws SignInAttemptMissing
     */
    public static function findLockedForJournal(string $attemptId): self
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->whereKey($attemptId)
            ->lockForUpdate()->firstOr(SignInAttemptMissing::throwing()->for($attemptId));
    }

    /**
     * The driver of an attempt, read before its locks are taken in their order: selection, then attempt.
     *
     * @throws SignInAttemptMissing
     */
    public static function resolveDriverForJournal(string $attemptId): string
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
    public static function resolveExpiredLiveIds(CarbonImmutable $now, int $limit): array
    {
        $ids = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->live()
            ->expiredBy($now)
            ->soonestExpiringFirst()
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
    public static function findRecentFor(CarbonImmutable $now): array
    {
        $attempts = self::query()
            ->liveOrUpdatedSince($now->subMinutes(15))
            ->newestFirst()
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
    public static function findLostBy(string $hostId, array $runningAttemptIds): array
    {
        $attempts = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->runOnHost($hostId)
            ->live()
            ->whereKeyNot($runningAttemptIds)
            ->oldestFirst()
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
    public static function findRunBy(string $hostId, string $attemptId): self
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->whereKey($attemptId)
            ->runOnHost($hostId)->firstOr(SignInAttemptMissing::throwing()->for($attemptId));
    }

    /**
     * The ended attempt whose staging folder a host has still to clean, for a new account or a reconnect alike; a
     * reconnect never touched the account's saved folder, so only its own staging folder is cleaned.
     */
    public static function findNextDueForCleanup(): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->cleanupDue()
            ->notLive()
            ->leastRecentlyUpdatedFirst()
            ->first();
    }

    /**
     * The owner's unfinished sign-ins whose staging folder still waits for its cleanup, oldest first.
     *
     * @return list<self>
     */
    public static function findPendingCleanups(): array
    {
        $attempts = self::query()
            ->cleanupPending()
            ->notLive()
            ->oldestFirst()
            ->limit(50)
            ->get();

        return array_values($attempts->all());
    }

    /**
     * The live attempts to sign an account in again that still wait for the account's processes to end.
     *
     * @return list<string>
     */
    public static function resolveWaitingForUsesIds(int $limit): array
    {
        $ids = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->waitingForUses()
            ->live()
            ->oldestFirst()
            ->readExactly($limit)
            ->pluck('id');

        return array_values(array_map(strval(...), $ids->all()));
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
     * The attempts still starting then that wait on no use and no host took.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function waitingToStartAt(Builder $query, CarbonImmutable $now): void
    {
        $query->where('status', SignInStatus::Starting->value)
            ->where('waits_for_uses', false)
            ->whereNull('process_reference')
            ->where('expires_at', '>', $now);
    }

    /**
     * The account's attempts; with none named, the attempts for a new account.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAccount(Builder $query, string|null $accountId): void
    {
        $query->where('account_id', $accountId);
    }

    /**
     * The attempts still going.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function live(Builder $query): void
    {
        $query->whereIn('status', array_map(fn (SignInStatus $state) => $state->value, SignInStatus::live()));
    }

    /**
     * The attempts that ended.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function notLive(Builder $query): void
    {
        $query->whereNotIn('status', array_map(fn (SignInStatus $state) => $state->value, SignInStatus::live()));
    }

    /**
     * The attempts expired by then.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function expiredBy(Builder $query, CarbonImmutable $now): void
    {
        $query->where('expires_at', '<=', $now);
    }

    /**
     * The attempts that expire first first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function soonestExpiringFirst(Builder $query): void
    {
        $query->orderBy('expires_at');
    }

    /**
     * The attempts still going or updated since that moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function liveOrUpdatedSince(Builder $query, CarbonImmutable $since): void
    {
        $query->where(fn (Builder $recent) => $recent->live()->orWhere('updated_at', '>=', $since));
    }

    /**
     * The attempts the host runs.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function runOnHost(Builder $query, string $hostId): void
    {
        $query->where('process_reference', $hostId);
    }

    /**
     * The attempts whose files wait to be cleaned up.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function cleanupPending(Builder $query): void
    {
        $query->where('cleanup_pending', true);
    }

    /**
     * The attempts whose files may be cleaned up now: tries left, and no kept account uses the folder.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function cleanupDue(Builder $query): void
    {
        $query->cleanupPending()
            ->where('cleanup_tries', '<', CleanupProgress::MOST_TRIES)
            ->whereNotNull('directory')
            ->whereNotExists(fn (QueryBuilder $accounts) => $accounts->from('accounts')
                ->whereColumn('accounts.directory', 'sign_in_attempts.directory')
                ->where('accounts.status', '!=', AccountStatus::Removed->value));
    }

    /**
     * The attempts that wait for the uses of their account to end.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function waitingForUses(Builder $query): void
    {
        $query->where('waits_for_uses', true);
    }

    /**
     * The attempts updated longest ago first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function leastRecentlyUpdatedFirst(Builder $query): void
    {
        $query->orderBy('updated_at');
    }
}

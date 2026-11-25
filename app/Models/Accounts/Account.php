<?php

declare(strict_types=1);

namespace App\Models\Accounts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Accounts\AccountCheckResult;
use App\Enums\Accounts\AccountStatus;
use App\Enums\Accounts\CleanupProblem;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Sessions\StartUnavailableReason;
use App\Events\Accounts\AccountCheckRequested;
use App\Events\Accounts\AccountCleaned;
use App\Events\Accounts\AccountCleanupReleased;
use App\Events\Accounts\AccountCleanupRetried;
use App\Events\Accounts\AccountHeldForMaintenance;
use App\Events\Accounts\AccountRecheckRequested;
use App\Events\Accounts\AccountRemovalStarted;
use App\Events\Accounts\AccountRemoved;
use App\Events\Accounts\AccountRenamed;
use App\Events\Accounts\AccountSignedIn;
use App\Events\Accounts\AccountSignedOut;
use App\Events\Accounts\AccountWriterClaimed;
use App\Events\Accounts\AccountWriterReleased;
use App\Exceptions\AccountLabelTaken;
use App\Exceptions\AccountMissing;
use App\Exceptions\AccountNameChanged;
use App\Exceptions\AccountRecheckRefused;
use App\Exceptions\AccountUnavailable;
use App\Models\Support\Accessor;
use App\Models\Support\AccountOwnerScope;
use App\Models\Support\KeepsCleanupTries;
use App\Support\RecordIdentity;
use App\Values\AccountLabel;
use App\Values\CleanupProgress;
use App\Values\SelectedAccount;
use App\Values\SignInIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @property string $id
 * @property string $account_protocol
 * @property SignInMethod $method
 * @property string $label
 * @property string $label_key
 * @property AccountStatus $status
 * @property string|null $directory
 * @property string|null $identity
 * @property string|null $subject
 * @property string|null $workspace
 * @property string|null $fingerprint
 * @property CarbonImmutable|null $expires_at
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
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property CarbonImmutable|null $check_inconclusive_at
 * @property int $name_revision
 * @property-read mixed $record_identity
 * @property-read mixed $selected_for_start
 * @property-read mixed $start_unavailable_reason
 *
 * @mixin \Eloquent
 */
final class Account extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use KeepsCleanupTries;
    use Linkable;
    use RaisesEvents;

    /**
     * @var list<string>
     */
    protected $hidden = [
        'directory',
        'live_writer_attempt_id',
        'operation_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => AccountStatus::class,
            'maintenance' => 'boolean',
            'sign_in_generation' => 'integer',
            'cleanup_pending' => 'boolean',
            'cleanup_released' => 'boolean',
            'store_removed' => 'boolean',
            'cleanup_tries' => 'integer',
            'cleanup_problem' => CleanupProblem::class,
            'check_requested_generation' => 'integer',
            'method' => SignInMethod::class,
            'checked_at' => 'immutable_datetime',
            'check_inconclusive_at' => 'immutable_datetime',
            'expires_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new account a completed sign-in made, signed in, in the folder that sign-in wrote; it starts the account's
     * first sign-in generation.
     */
    public static function create(string $driver, AccountLabel $label, string $directory): self
    {
        $account = new self();
        $account->account_protocol = $driver;
        $account->name($label);
        $account->status = AccountStatus::Authenticated;
        $account->directory = $directory;
        $account->sign_in_generation = 1;
        $account->save();

        return $account;
    }

    // ----------[ Mutations ]----------

    /**
     * The account signed in by the attempt that holds its folder, now kept in the folder the attempt signed in to:
     * signed in, checked now, its writer released. Signed
     * in again, it starts a new sign-in generation, so a report or check from before is out of date, and starts may
     * use it again.
     */
    public function signedInAgain(
        SignInAttempt $attempt,
        SignInIdentity $identity,
        string $directory,
        CarbonImmutable $checkedAt,
    ): void {
        if ($this->live_writer_attempt_id === $attempt->id) {
            $this->sign_in_generation++;
            $this->maintenance = false;
            $this->check_requested_generation = null;
        }

        $this->status = AccountStatus::Authenticated;
        $this->directory = $directory;
        $this->method = $attempt->method;
        $this->fingerprint = $attempt->fingerprint;
        $this->identity = $identity->display;
        $this->subject = $identity->subject;
        $this->workspace = $identity->workspace;
        $this->expires_at = $identity->expiry();
        $this->checked_at = $checkedAt;
        $this->assertSaved($this->save());
        $this->raise(new AccountSignedIn($this->account_protocol, $this->id));
        $this->releaseWriter($attempt->id);
    }

    /**
     * A sign-in again ended without success. A signed-in account stays held until the host checks it in its current
     * generation, as the attempt may have changed its folder; one that needed a sign-in is simply let go. An older
     * attempt's end changes nothing of a newer writer's hold.
     */
    public function endSignInAgain(string $attemptId): void
    {
        if ($this->live_writer_attempt_id !== $attemptId) {
            return;
        }

        if ($this->status === AccountStatus::Authenticated) {
            $this->check_requested_generation = $this->sign_in_generation;
        } else {
            $this->maintenance = false;
        }

        $this->releaseWriter($attemptId);
    }

    /**
     * The owner asks the host to check a held account again after its last check could not tell.
     *
     * @throws AccountRecheckRefused when the account waits for no such check
     */
    public function recheck(): void
    {
        $this->assertRecheckPending();

        $this->check_inconclusive_at = null;
        $this->assertSaved($this->save());
        $this->raise(new AccountRecheckRequested($this->account_protocol, $this->id));
    }

    /**
     * Asks the host to check the account after a rejected sign-in seen in this generation; a failure from an older
     * generation, such as one from before a new sign-in, asks nothing.
     */
    public function requestCheck(int $generation): bool
    {
        if (! $this->isGeneration($generation) || $this->status !== AccountStatus::Authenticated) {
            return false;
        }

        $this->check_requested_generation = $generation;
        $this->save();
        $this->raise(new AccountCheckRequested($this->account_protocol, $this->id, $generation));

        return true;
    }

    /**
     * Applies the host's check made in the given generation, and answers whether it showed the account signed out;
     * a check of an older generation changes nothing, only a definite sign-out needs a new sign-in, and an account
     * held for its check after a sign-in again stays held until the answer is certain.
     */
    public function applyCheck(int $generation, AccountCheckResult $check, CarbonImmutable $now): bool
    {
        if (! $this->isGeneration($generation)) {
            return false;
        }

        $isHeldForCheck = $this->isHeldForCheck();

        if ($isHeldForCheck && $check === AccountCheckResult::Unknown) {
            $this->check_inconclusive_at = $now;
            $this->assertSaved($this->save());

            return false;
        }

        if ($isHeldForCheck) {
            $this->maintenance = false;
        }

        $this->check_requested_generation = null;
        $this->check_inconclusive_at = null;
        $this->checked_at = $now;
        $isSignedOut = $check === AccountCheckResult::SignedOut && $this->status === AccountStatus::Authenticated;

        if ($isSignedOut) {
            $this->status = AccountStatus::Unauthenticated;
        }

        $this->assertSaved($this->save());

        if ($isSignedOut) {
            $this->raise(new AccountSignedOut($this->account_protocol, $this->id));
        }

        return $isSignedOut;
    }

    /**
     * Gives the account a new name, which no other account of its driver in use may share, ignoring case, and advances
     * its name revision; a name saved against an older revision is refused, so a rename made meanwhile is never
     * overwritten unseen. The same name again changes nothing.
     *
     * @throws AccountLabelTaken
     * @throws AccountNameChanged
     */
    public function rename(AccountLabel $label, int|null $seenRevision = null): void
    {
        $this->assertNameUnchangedSince($seenRevision);

        if ($label->label === $this->label) {
            return;
        }

        $this->assertLabelFree($label);
        $this->name($label);
        $this->name_revision++;
        $this->assertSaved($this->save());
        $this->raise(new AccountRenamed($this->account_protocol, $this->id));
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
        $this->raise(new AccountWriterClaimed($this->account_protocol, $this->id, $attempt->id));

        return $attempt->id;
    }

    /**
     * Lets the attempt's writer go when it holds the folder; another attempt's hold is left as it is.
     */
    public function releaseWriter(string $attemptId): void
    {
        if ($this->live_writer_attempt_id !== $attemptId) {
            return;
        }

        $this->live_writer_attempt_id = null;
        $this->save();
        $this->raise(new AccountWriterReleased($this->account_protocol, $this->id, $attemptId));
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
        $this->assertSaved($this->save());
        $this->raise(new AccountHeldForMaintenance($this->account_protocol, $this->id));
    }

    /**
     * Holds the account for removal as one operation: no new start starts on it, no writer holds its folder and
     * every older report, check or cancellation is out of date.
     */
    public function beginRemoval(): void
    {
        $this->status = AccountStatus::Removing;
        $this->maintenance = true;
        $this->cleanup_pending = true;
        $this->cleanup_released = false;
        $this->store_removed = false;
        $this->live_writer_attempt_id = null;
        $this->check_requested_generation = null;
        $this->operation_id = strtolower((string) Str::ulid());
        $this->sign_in_generation++;
        $this->assertSaved($this->save());
        $this->raise(new AccountRemovalStarted($this->account_protocol, $this->id));
    }

    /**
     * The owner asks for the cleanup again after its tries ran out; it still waits for the account's processes and
     * keeps its generation, so nothing newer is cleaned.
     */
    public function retryCleanup(): void
    {
        if ($this->status !== AccountStatus::Removing) {
            return;
        }

        $this->resetCleanupTries();
        $this->raise(new AccountCleanupRetried($this->account_protocol, $this->id));
    }

    /**
     * Every process on the account ended: a host may now sign it out and delete its folder.
     */
    public function releaseCleanup(): void
    {
        $this->cleanup_released = true;
        $this->save();
        $this->raise(new AccountCleanupReleased($this->account_protocol, $this->id));
    }

    /**
     * Applies what a host proved of the cleanup made in the given generation: the store's proof is kept even when the
     * folder is not yet gone, and the removal ends only with both. A report of another generation changes nothing.
     */
    public function applyCleanup(int $generation, CleanupProgress $progress): bool
    {
        if (! $this->isGeneration($generation) || $this->status !== AccountStatus::Removing) {
            return false;
        }

        if (! $this->recordCleanupTry($progress)) {
            $this->save();

            return false;
        }

        $this->finishRemoval();
        $this->raise(new AccountCleaned($this->account_protocol, $this->id));

        return true;
    }

    /**
     * Ends the removal once the processes are gone and the driver's store and folder are deleted; the row, its link
     * and its label stay for history.
     */
    public function finishRemoval(): void
    {
        $this->status = AccountStatus::Removed;
        $this->directory = null;
        $this->maintenance = false;
        $this->cleanup_pending = false;
        $this->live_writer_attempt_id = null;
        $this->assertSaved($this->save());
        $this->raise(new AccountRemoved($this->account_protocol, $this->id));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the sign-in and this account both name the provider's own verified subject, so they can be compared at
     * all; a display email is never such evidence.
     */
    public function canCompareWith(SignInIdentity $identity): bool
    {
        return $this->subject !== null && $identity->subject !== null;
    }

    public function isSamePrincipal(SignInIdentity $identity): bool
    {
        return $this->subject !== null
            && $identity->subject === $this->subject
            && $identity->workspace === $this->workspace;
    }

    /**
     * Whether a report or a check made in this sign-in generation still speaks for the account.
     */
    public function isGeneration(int $generation): bool
    {
        return $this->sign_in_generation === $generation;
    }

    /**
     * Whether the account is held for its check and the last check could not tell, so the owner may ask again.
     */
    public function isCheckInconclusive(): bool
    {
        return $this->isHeldForCheck() && $this->check_inconclusive_at !== null;
    }

    public function isHeldForCheck(): bool
    {
        return $this->maintenance
            && $this->live_writer_attempt_id === null
            && $this->status === AccountStatus::Authenticated
            && $this->check_requested_generation !== null;
    }

    public function hasLiveWriter(): bool
    {
        return $this->live_writer_attempt_id !== null;
    }

    /**
     * Whether the host stopped trying the cleanup on its own and waits for the owner's Retry.
     */
    public function awaitsCleanupRetry(): bool
    {
        return $this->status === AccountStatus::Removing && $this->hasUsedEveryCleanupTry();
    }

    public function isBeingRemoved(): bool
    {
        return in_array($this->status, [
            AccountStatus::Removing,
            AccountStatus::Removed,
        ], true);
    }

    // ----------[ Calculations ]----------

    /**
     * The folder a start runs the driver's sign-in from; reading it on a removed account, which has none, fails.
     *
     * @throws AccountUnavailable
     */
    public function directoryForStart(): string
    {
        $this->assertHasDirectory();

        return $this->directory;
    }

    // ----------[ Accessors ]----------

    /**
     * The account as the start it is chosen for runs with it.
     *
     * @return Attribute<SelectedAccount, never>
     */
    protected function selectedForStart(): Attribute
    {
        return Accessor::get(fn () => new SelectedAccount(
            $this->record_identity,
            $this->account_protocol,
            $this->directoryForStart(),
            $this->sign_in_generation,
        ));
    }

    /**
     * @return Attribute<RecordIdentity, never>
     */
    protected function recordIdentity(): Attribute
    {
        return Accessor::get(fn () => new RecordIdentity(self::linkType(), $this->id));
    }

    /**
     * Why a start cannot use the account now, none while it is signed in and not held for maintenance.
     *
     * @return Attribute<StartUnavailableReason|null, never>
     */
    protected function startUnavailableReason(): Attribute
    {
        return Accessor::get(function () {
            if ($this->status->canStart() && ! $this->maintenance) {
                return null;
            }

            return $this->status->startUnavailableReason();
        });
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a start on an account that is not signed in or is held for maintenance.
     *
     * @throws AccountUnavailable
     */
    public function assertAvailable(): void
    {
        $reason = $this->start_unavailable_reason;

        if ($reason !== null) {
            throw AccountUnavailable::forStart($this->account_protocol, $reason);
        }
    }

    /**
     * Refuses a chosen account whose sign-in changed after the owner reviewed it.
     *
     * @throws AccountUnavailable
     */
    public function assertReviewed(int $signIn): void
    {
        if ($this->sign_in_generation !== $signIn) {
            throw AccountUnavailable::forStart($this->account_protocol, StartUnavailableReason::ChosenAccountChanged);
        }
    }

    /**
     * Refuses an account that is not there or was removed.
     *
     * @throws AccountMissing
     */
    private function assertNotRemoved(): void
    {
        if ($this->status === AccountStatus::Removed) {
            throw AccountMissing::for($this->id);
        }
    }

    /**
     * Refuses an account whose driver could not be read: the account is not there.
     *
     * @phpstan-assert string $driver
     *
     * @throws AccountMissing
     */
    private static function assertDriverFound(mixed $driver, string $accountId): void
    {
        if (! is_string($driver)) {
            throw AccountMissing::for($accountId);
        }
    }

    /**
     * Refuses a recheck of an account whose last check was not inconclusive.
     *
     * @throws AccountRecheckRefused
     */
    private function assertRecheckPending(): void
    {
        if (! $this->isCheckInconclusive()) {
            throw AccountRecheckRefused::notPending($this->id);
        }
    }

    /**
     * Refuses a rename made against a name that changed since the revision the caller saw.
     *
     * @throws AccountNameChanged
     */
    private function assertNameUnchangedSince(int|null $seenRevision): void
    {
        if ($seenRevision !== null && $seenRevision !== $this->name_revision) {
            throw AccountNameChanged::meanwhile($this->label);
        }
    }

    /**
     * Refuses a label another live account of the driver already holds.
     *
     * @throws AccountLabelTaken
     */
    private function assertLabelFree(AccountLabel $label): void
    {
        $isTaken = self::query()
            ->ofDriver($this->account_protocol)
            ->withLabel($label)
            ->kept()
            ->whereKeyNot($this->id)
            ->exists();

        if ($isTaken) {
            throw AccountLabelTaken::for($this->account_protocol, $label->label);
        }
    }

    /**
     * Refuses a start of an account with no folder on the host.
     *
     * @phpstan-assert !null $this->directory
     *
     * @throws AccountUnavailable
     */
    private function assertHasDirectory(): void
    {
        if ($this->directory === null) {
            throw AccountUnavailable::forStart($this->account_protocol, StartUnavailableReason::NoAccount);
        }
    }

    // ----------[ Internals ]----------

    private static function labelIsTaken(string $driver, AccountLabel $label): bool
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofDriver($driver)
            ->withLabel($label)
            ->kept()
            ->exists();
    }

    private function name(AccountLabel $label): void
    {
        $this->label = $label->label;
        $this->label_key = $label->key();
    }

    // ----------[ Queries ]----------

    /**
     * The method the account signed in by, read by the journal for a start on it; none for an account that is gone.
     */
    public static function resolveMethodOf(string $accountId): SignInMethod|null
    {
        return self::query()->withoutGlobalScope(AccountOwnerScope::class)->whereKey($accountId)->first()?->method;
    }

    /**
     * The first free label of the driver for a new account: the proposed one, else its numbered variants from 2.
     */
    public static function resolveFreeLabel(string $driver, AccountLabel $proposed): AccountLabel
    {
        $label = $proposed;

        for ($number = 2; self::labelIsTaken($driver, $label); $number++) {
            $label = $proposed->numbered($number);
        }

        return $label;
    }

    /**
     * The driver's account, not removed, that holds the principal a verified sign-in proved; none for a sign-in that
     * proved no subject.
     */
    public static function findHoldingPrincipal(string $driver, SignInIdentity $identity): self|null
    {
        if ($identity->subject === null) {
            return null;
        }

        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofDriver($driver)
            ->ofSubject($identity->subject)
            ->kept()
            ->limit(20)
            ->get()
            ->first(fn (self $account) => $account->isSamePrincipal($identity));
    }

    /**
     * Whether another account of the attempt's driver, not removed, already signs in by the key or token the attempt
     * was given; an attempt without a key holds none.
     */
    public static function findHoldingKeyOf(SignInAttempt $attempt): self|null
    {
        if ($attempt->fingerprint === null) {
            return null;
        }

        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofDriver($attempt->account_protocol)
            ->withFingerprint($attempt->fingerprint)
            ->kept()
            ->apartFrom($attempt->account_id)
            ->first();
    }

    /**
     * The account the owner may change, locked for the rest of the transaction; a removed account keeps its name for
     * history and is never changed again.
     *
     * @throws AccountMissing
     */
    public static function findLockedForChange(string $accountId): self
    {
        $account = self::query()->whereKey($accountId)->lockForUpdate()->firstOr(
            AccountMissing::throwing()->for($accountId),
        );

        $account->assertNotRemoved();

        return $account;
    }

    /**
     * The owner's accounts that are not removed, by driver and name.
     *
     * @return list<self>
     */
    public static function findListed(): array
    {
        $accounts = self::query()
            ->kept()
            ->inListOrder()
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
    public static function findLockedForStart(string $accountId): self
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
     * The account the owner chose for a start, locked and checked again: only the owner reads it, it runs the
     * driver, it accepts starts and its sign-in is still the one the owner reviewed. The saved default is untouched.
     *
     * @throws AccountUnavailable
     */
    public static function findLockedChosenForStart(string $driver, string $accountId, int $reviewedSignIn): self
    {
        $account = self::query()
            ->whereKey($accountId)
            ->ofDriver($driver)
            ->lockForUpdate()
            ->firstOr(AccountUnavailable::throwing()->forStart($driver, StartUnavailableReason::ChosenAccountMissing));

        $account->assertAvailable();
        $account->assertReviewed($reviewedSignIn);

        return $account;
    }

    /**
     * The account locked for the journal's own maintenance or the host that signs it in, whoever acts.
     */
    public static function findLockedForJournal(string $accountId): self
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->whereKey($accountId)
            ->lockForUpdate()
            ->firstOrFail();
    }

    /**
     * The next account whose check a host runs, for the journal's host transport whoever acts; none when none waits.
     * A held account whose last check could not tell waits for the owner's recheck.
     */
    public static function findNextDueForCheck(): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->checkDue()
            ->leastRecentlyUpdatedFirst()
            ->lockForUpdate()
            ->first();
    }

    /**
     * The driver of an account, for the journal's own maintenance or the host, read before its locks are taken.
     */
    public static function resolveDriverForJournal(string $accountId): string
    {
        $driver = self::query()->withoutGlobalScope(
            AccountOwnerScope::class,
        )->whereKey($accountId)->value('account_protocol');

        return (string) $driver;
    }

    /**
     * The driver of the account the owner may change, read before its locks are taken in their order.
     *
     * @throws AccountMissing
     */
    public static function resolveDriverOf(string $accountId): string
    {
        $driver = self::query()->whereKey($accountId)->value('account_protocol');
        self::assertDriverFound($driver, $accountId);

        return $driver;
    }

    /**
     * The removed accounts whose processes are all gone and whose sign-in or folder a host has still to clean.
     */
    public static function findNextDueForCleanup(): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->cleanupDue()
            ->leastRecentlyUpdatedFirst()
            ->first();
    }

    /**
     * The accounts being removed that still wait for their processes to end.
     *
     * @return list<string>
     */
    public static function resolveWaitingForCleanupIds(int $limit): array
    {
        $ids = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->awaitingCleanupRelease()
            ->leastRecentlyUpdatedFirst()
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
     * The accounts of that label.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withLabel(Builder $query, AccountLabel $label): void
    {
        $query->where('label_key', $label->key());
    }

    /**
     * The accounts not removed.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function kept(Builder $query): void
    {
        $query->where('status', '!=', AccountStatus::Removed->value);
    }

    /**
     * The accounts signed in as that subject.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSubject(Builder $query, string $subject): void
    {
        $query->where('subject', $subject);
    }

    /**
     * The accounts of that key fingerprint.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withFingerprint(Builder $query, string $fingerprint): void
    {
        $query->where('fingerprint', $fingerprint);
    }

    /**
     * The accounts other than that one; all of them with none named.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function apartFrom(Builder $query, string|null $accountId): void
    {
        $query->when($accountId !== null, fn (Builder $others) => $others->whereKeyNot($accountId));
    }

    /**
     * The accounts by driver, then label.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inListOrder(Builder $query): void
    {
        $query->orderBy('account_protocol')->orderBy('label_key');
    }

    /**
     * The accounts a check was asked for that has not come back inconclusive.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function checkDue(Builder $query): void
    {
        $query->whereNotNull('check_requested_generation')->whereNull('check_inconclusive_at');
    }

    /**
     * The accounts being removed whose files are released for cleanup and may be tried again.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function cleanupDue(Builder $query): void
    {
        $query->where('status', AccountStatus::Removing->value)
            ->where('cleanup_released', true)
            ->where('cleanup_tries', '<', CleanupProgress::MOST_TRIES)
            ->whereNotNull('directory');
    }

    /**
     * The accounts being removed whose files are not released for cleanup yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function awaitingCleanupRelease(Builder $query): void
    {
        $query->where('status', AccountStatus::Removing->value)->where('cleanup_released', false);
    }

    /**
     * The accounts updated longest ago first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function leastRecentlyUpdatedFirst(Builder $query): void
    {
        $query->orderBy('updated_at');
    }
}

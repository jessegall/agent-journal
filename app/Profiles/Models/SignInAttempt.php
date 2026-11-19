<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Links\Support\Linkable;
use App\Profiles\Enums\SignInState;
use App\Profiles\Exceptions\SignInAttemptMissing;
use App\Profiles\Models\Support\HumanAccounts;
use App\Profiles\Values\AccountLabel;
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

/**
 * One run of a program's own sign-in: for a new account, or to sign an existing one in again. Its private folder,
 * process and login references never leave the server, and no challenge, code or token is ever kept on it. A finished
 * attempt may still owe the deletion of what it left behind.
 *
 * @property string $id
 * @property string $program
 * @property string|null $account_id
 * @property string|null $label
 * @property SignInState $state
 * @property string $request_key
 * @property int $generation
 * @property string|null $directory
 * @property string|null $process_reference
 * @property string|null $login_reference
 * @property bool $cleanup_pending
 * @property CarbonImmutable $expires_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Account|null $account
 */
#[Fillable(['program', 'label'])]
final class SignInAttempt extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.sign-in-attempt';

    /**
     * @var list<string>
     */
    protected $hidden = ['directory', 'process_reference', 'login_reference', 'request_key'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => SignInState::class,
            'generation' => 'integer',
            'cleanup_pending' => 'boolean',
            'expires_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new attempt to sign in a new account under a name.
     */
    public static function forNewAccount(
        HookProgram $program,
        AccountLabel $label,
        string $directory,
        string $requestKey,
        CarbonImmutable $expiresAt,
    ): self {
        $attempt = new self(['program' => $program->value, 'label' => $label->label]);
        $attempt->directory = $directory;
        $attempt->begin($requestKey, $expiresAt);

        return $attempt;
    }

    /**
     * A new attempt to sign an existing account in again, in the sign-in generation the account is in.
     */
    public static function forAccount(Account $account, string $requestKey, CarbonImmutable $expiresAt): self
    {
        $attempt = new self(['program' => $account->program]);
        $attempt->account_id = $account->id;
        $attempt->generation = $account->sign_in_generation;
        $attempt->directory = $account->directory;
        $attempt->begin($requestKey, $expiresAt);

        return $attempt;
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
            ->withoutGlobalScope(HumanAccounts::class)
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
        $program = self::query()->withoutGlobalScope(HumanAccounts::class)->whereKey($attemptId)->value('program');

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
            ->withoutGlobalScope(HumanAccounts::class)
            ->whereIn('state', array_map(fn (SignInState $state) => $state->value, SignInState::live()))
            ->where('expires_at', '<=', $now)
            ->orderBy('expires_at')
            ->readLimit($limit)
            ->pluck('id');

        return array_values(array_map(strval(...), $ids->all()));
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
     * Ends a live attempt in the given state; an attempt that made no account still owes the deletion of its folder.
     */
    public function end(SignInState $state): void
    {
        $this->state = $state;
        $this->cleanup_pending = $this->account_id === null && $state !== SignInState::Complete;
        $this->save();
    }

    /**
     * The program's sign-in started and now waits for its person; only from here may a verified result complete it.
     */
    public function waitForPerson(): void
    {
        if ($this->state !== SignInState::Starting) {
            return;
        }

        $this->state = SignInState::Waiting;
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
     * Ends the attempt and lets go of the account folder it wrote, so a later attempt may write it.
     */
    public function finish(SignInState $state): void
    {
        $this->end($state);

        if ($this->account_id !== null) {
            Account::lockedForJournal($this->account_id)->releaseWriter($this);
        }
    }

    /**
     * Whether a sign-in result the host reports still speaks for this attempt: it is live, within its deadline, and
     * made in the attempt's sign-in generation.
     */
    public function accepts(int $generation, CarbonImmutable $now): bool
    {
        return $this->state->canComplete() && ! $this->isExpiredAt($now) && $this->generation === $generation;
    }

    /**
     * @return BelongsTo<Account, $this>
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

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
        $this->save();
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

<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Links\Support\Linkable;
use App\Profiles\Enums\SignInState;
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
        string $requestKey,
        CarbonImmutable $expiresAt,
    ): self {
        $attempt = new self(['program' => $program->value, 'label' => $label->label]);
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
     * @return BelongsTo<Account, $this>
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
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

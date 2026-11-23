<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\BindingReadiness;
use App\Enums\DeviceGrantState;
use App\Exceptions\DeviceGrantRefused;
use App\Support\ShortReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * A shell user's grant to run journal verbs for one binding: started by the shell with a device code, approved by
 * the signed-in owner who checked its user code, binding and scopes, then handed to the shell once as a short-lived
 * grant. Its revocation leaves the binding connected.
 *
 * @property string $id
 * @property string $binding_id
 * @property string $device_code_digest
 * @property string $user_code
 * @property list<string> $scopes
 * @property DeviceGrantState $state
 * @property string|null $approved_by_user_id
 * @property string|null $reference
 * @property int $generation
 * @property string|null $start_key
 * @property string|null $environment_id
 * @property CarbonImmutable $code_expires_at
 * @property string|null $grant_digest
 * @property CarbonImmutable|null $grant_expires_at
 * @property CarbonImmutable|null $last_polled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read ProjectBinding $binding
 */
#[Fillable([
    'binding_id', 'device_code_digest', 'user_code', 'scopes', 'state', 'code_expires_at', 'reference', 'generation',
    'start_key', 'environment_id',
])]
final class DeviceGrant extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * How long the owner has to approve a device code.
     */
    public const int CODE_MINUTES = 10;

    /**
     * How long an approved grant lets the shell run verbs.
     */
    public const int GRANT_HOURS = 12;

    /**
     * The fewest seconds between two polls of one device code.
     */
    public const int POLL_SECONDS_MINIMUM = 5;

    public const array SCOPES = ['commands'];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scopes' => 'array',
            'state' => DeviceGrantState::class,
            'code_expires_at' => 'immutable_datetime',
            'grant_expires_at' => 'immutable_datetime',
            'last_polled_at' => 'immutable_datetime',
        ];
    }

    /**
     * A terminal sign-in's grant for the binding, pending the owner's approval: a nonsecret reference, the next
     * generation of the binding's sign-ins, the key its start came under and the binding's environment.
     */
    public static function create(ProjectBinding $binding, string $codeDigest, string $userCode, string $startKey): self
    {
        $grant = new self();
        $grant->binding_id = $binding->id;
        $grant->reference = ShortReference::withPrefix('TS');
        $grant->generation = self::nextGenerationOf($binding);
        $grant->start_key = $startKey;
        $grant->environment_id = $binding->environment_id;
        $grant->device_code_digest = $codeDigest;
        $grant->user_code = $userCode;
        $grant->scopes = self::SCOPES;
        $grant->state = DeviceGrantState::Pending;
        $grant->code_expires_at = CarbonImmutable::now()->addMinutes(self::CODE_MINUTES);
        $grant->save();

        return $grant;
    }

    // ----------[ Queries ]----------

    /**
     * The grant of this user code, with its binding, for the owner to check.
     */
    public static function ofUserCode(string $code): self
    {
        return self::query()->with(['binding', 'environment'])->where('user_code', $code)->firstOrFail();
    }

    /**
     * The grant a start under this key made for the binding, none or one, locked until the transaction ends: a start
     * whose reply was lost finds it again.
     *
     * @return list<self>
     */
    public static function lockOfStart(ProjectBinding $binding, string $startKey): array
    {
        return array_values(self::query()->where('binding_id', $binding->id)->where('start_key', $startKey)
            ->lockForUpdate()->limit(1)->get()->all());
    }

    /**
     * The terminal sign-ins of these bindings, newest first, in one read; a binding has a few shells that asked.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function listedOfBindings(array $ids): array
    {
        return array_values(self::query()->whereIn('binding_id', $ids)->orderByDesc('created_at')->orderByDesc('id')
            ->readAll('a binding has a device grant per shell that asked')->get()->all());
    }

    /**
     * The generation the binding's next sign-in gets: one past its newest.
     */
    public static function nextGenerationOf(ProjectBinding $binding): int
    {
        return (int) self::query()->where('binding_id', $binding->id)->max('generation') + 1;
    }

    /**
     * The grant of this id, locked until the transaction ends.
     */
    public static function lockById(string $id): self
    {
        return self::query()->with('binding')->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * The pending grant of a user code the owner is about to approve, locked until the transaction ends.
     *
     * @throws DeviceGrantRefused
     */
    public static function lockPendingByUserCode(string $code): self
    {
        return self::query()->with('binding')->where('user_code', $code)->where('state', DeviceGrantState::Pending)
            ->where('code_expires_at', '>', CarbonImmutable::now())->lockForUpdate()
            ->firstOr(fn () => throw DeviceGrantRefused::unknownCode());
    }

    /**
     * The grant a shell polls for with its device code, locked until the transaction ends.
     *
     * @throws DeviceGrantRefused
     */
    public static function lockByDeviceCode(string $digest): self
    {
        return self::query()->with('binding')->where('device_code_digest', $digest)->lockForUpdate()
            ->firstOr(fn () => throw DeviceGrantRefused::unknownCode());
    }

    /**
     * The issued, unexpired and approved grant of this digest, with its binding.
     *
     * @throws DeviceGrantRefused
     */
    public static function usableByDigest(string $digest): self
    {
        return self::query()->with('binding')->where('grant_digest', $digest)
            ->where('state', DeviceGrantState::Issued)->where('grant_expires_at', '>', CarbonImmutable::now())
            ->whereNotNull('approved_by_user_id')
            ->whereHas('binding', fn ($binding) => $binding->where('readiness', '!=', BindingReadiness::Revoked))
            ->firstOr(fn () => throw DeviceGrantRefused::notUsable());
    }

    /**
     * The grants of the binding not revoked yet, locked until the transaction ends; a binding has a few shells.
     *
     * @return list<self>
     */
    public static function lockLiveOf(ProjectBinding $binding): array
    {
        return array_values(self::query()->where('binding_id', $binding->id)
            ->where('state', '!=', DeviceGrantState::Revoked)->lockForUpdate()
            ->readAll('a binding has a device grant per shell that asked')->get()->all());
    }

    // ----------[ Mutations ]----------

    /**
     * Gives a pending grant the device code of a start sent again under its key, as the one before never reached the
     * terminal.
     */
    public function restartWith(string $codeDigest): void
    {
        $this->device_code_digest = $codeDigest;
        $this->save();
    }

    public function approveBy(string $userId): void
    {
        $this->approved_by_user_id = $userId;
        $this->state = DeviceGrantState::Approved;
        $this->save();
    }

    /**
     * Records a poll; refuses one sooner than POLL_SECONDS_MINIMUM after the last.
     *
     * @throws DeviceGrantRefused
     */
    public function recordPoll(): void
    {
        $now = CarbonImmutable::now();

        $tooSoon = $this->last_polled_at !== null
            && $this->last_polled_at->addSeconds(self::POLL_SECONDS_MINIMUM)->isAfter($now);

        // A poll sooner than the interval leaves the last one as it was, so polling fast never moves it on.
        if ($tooSoon) {
            throw DeviceGrantRefused::pollingTooFast();
        }

        $this->last_polled_at = $now;
        $this->save();
    }

    /**
     * Hands the approved grant to the shell once, by the digest of the grant it receives.
     */
    public function issue(string $digest): void
    {
        $this->grant_digest = $digest;
        $this->grant_expires_at = CarbonImmutable::now()->addHours(self::GRANT_HOURS);
        $this->state = DeviceGrantState::Issued;
        $this->save();
    }

    public function revoke(): void
    {
        $this->state = DeviceGrantState::Revoked;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function isApproved(): bool
    {
        return $this->state === DeviceGrantState::Approved;
    }

    /**
     * Where the request stands for the owner at this server time: pending, approved and awaiting collection, issued,
     * expired before approval, or revoked.
     */
    public function approvalStateAt(CarbonImmutable $now): string
    {
        if ($this->state === DeviceGrantState::Pending && ! $now->lessThan($this->code_expires_at)) {
            return 'expired';
        }

        return $this->state->value;
    }

    /**
     * Answers what a poll of a grant past its approval gets: the bearer went out once, so a repeated poll learns its
     * reference to withdraw it, and a revoked grant says so.
     *
     * @throws DeviceGrantRefused
     */
    public function assertNotCollected(): void
    {
        if ($this->state === DeviceGrantState::Revoked) {
            throw DeviceGrantRefused::revoked((string) $this->reference);
        }

        if ($this->state === DeviceGrantState::Issued) {
            throw DeviceGrantRefused::alreadyIssued((string) $this->reference);
        }
    }

    public function isCodeExpired(): bool
    {
        return ! CarbonImmutable::now()->lessThan($this->code_expires_at);
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<ProjectBinding, $this>
     */
    public function binding(): BelongsTo
    {
        return $this->belongsTo(ProjectBinding::class);
    }

    /**
     * @return BelongsTo<Environment, $this>
     */
    public function environment(): BelongsTo
    {
        return $this->belongsTo(Environment::class);
    }
}

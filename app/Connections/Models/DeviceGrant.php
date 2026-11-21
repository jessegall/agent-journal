<?php

declare(strict_types=1);

namespace App\Connections\Models;

use App\Connections\Enums\BindingReadiness;
use App\Connections\Enums\DeviceGrantState;
use App\Connections\Exceptions\DeviceGrantRefused;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
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
 * @property CarbonImmutable $code_expires_at
 * @property string|null $grant_digest
 * @property CarbonImmutable|null $grant_expires_at
 * @property CarbonImmutable|null $last_polled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read ProjectBinding $binding
 */
#[Fillable(['binding_id', 'device_code_digest', 'user_code', 'scopes', 'state', 'code_expires_at'])]
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
    public const int POLL_SECONDS = 5;

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

    public static function start(ProjectBinding $binding, string $deviceCodeDigest, string $userCode): self
    {
        $grant = new self();
        $grant->binding_id = $binding->id;
        $grant->device_code_digest = $deviceCodeDigest;
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
    public static function ofUserCode(string $userCode): self
    {
        return self::query()->with('binding')->where('user_code', $userCode)->firstOrFail();
    }

    /**
     * The grant of this id, locked until the transaction ends.
     */
    public static function lockById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * The pending grant of a user code the owner is about to approve, locked until the transaction ends.
     *
     * @throws DeviceGrantRefused
     */
    public static function lockPendingByUserCode(string $userCode): self
    {
        return self::query()->where('user_code', $userCode)->where('state', DeviceGrantState::Pending)
            ->where('code_expires_at', '>', CarbonImmutable::now())->lockForUpdate()
            ->firstOr(fn () => throw DeviceGrantRefused::unknownCode());
    }

    /**
     * The grant a shell polls for with its device code, locked until the transaction ends.
     *
     * @throws DeviceGrantRefused
     */
    public static function lockByDeviceCode(string $deviceCodeDigest): self
    {
        return self::query()->with('binding')->where('device_code_digest', $deviceCodeDigest)->lockForUpdate()
            ->firstOr(fn () => throw DeviceGrantRefused::unknownCode());
    }

    /**
     * The issued, unexpired grant of this digest, with its binding.
     *
     * @throws DeviceGrantRefused
     */
    public static function usable(string $grantDigest): self
    {
        return self::query()->with('binding')->where('grant_digest', $grantDigest)
            ->where('state', DeviceGrantState::Issued)->where('grant_expires_at', '>', CarbonImmutable::now())
            ->whereHas('binding', fn ($binding) => $binding->where('readiness', '!=', BindingReadiness::Revoked))
            ->firstOr(fn () => throw DeviceGrantRefused::notUsable());
    }

    // ----------[ Mutations ]----------

    public function approveBy(string $userId): void
    {
        $this->approved_by_user_id = $userId;
        $this->state = DeviceGrantState::Approved;
        $this->save();
    }

    /**
     * Records a poll; refuses one sooner than POLL_SECONDS after the last.
     *
     * @throws DeviceGrantRefused
     */
    public function recordPoll(): void
    {
        $now = CarbonImmutable::now();

        if ($this->last_polled_at !== null && $now->lessThan($this->last_polled_at->addSeconds(self::POLL_SECONDS))) {
            throw DeviceGrantRefused::pollingTooFast();
        }

        $this->last_polled_at = $now;
        $this->save();
    }

    /**
     * Hands the approved grant to the shell once, by the digest of the grant it receives.
     */
    public function issue(string $grantDigest): void
    {
        $this->grant_digest = $grantDigest;
        $this->grant_expires_at = CarbonImmutable::now()->addHours(self::GRANT_HOURS);
        $this->state = DeviceGrantState::Issued;
        $this->save();
    }

    /**
     * Revokes every grant of a revoked binding at once; grants to other bindings keep their own scope.
     */
    public static function revokeEveryGrantOf(ProjectBinding $binding): void
    {
        self::query()->where('binding_id', $binding->id)->where('state', '!=', DeviceGrantState::Revoked)
            ->update(['state' => DeviceGrantState::Revoked]);
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
}

<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Projects\DeviceGrantStatus;
use App\Events\Connections\DeviceGrantApproved;
use App\Events\Connections\DeviceGrantIssued;
use App\Events\Connections\DeviceGrantPolled;
use App\Events\Connections\DeviceGrantRestarted;
use App\Events\Connections\DeviceGrantRevoked;
use App\Exceptions\DeviceGrantRefused;
use App\Support\ShortReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $binding_id
 * @property string $device_code_digest
 * @property string $user_code
 * @property list<string> $scopes
 * @property DeviceGrantStatus $status
 * @property string|null $approved_by_user_id
 * @property CarbonImmutable $code_expires_at
 * @property string|null $grant_digest
 * @property CarbonImmutable|null $grant_expires_at
 * @property CarbonImmutable|null $last_polled_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property string|null $reference
 * @property int $generation
 * @property string|null $start_key
 * @property string|null $environment_id
 * @property-read ProjectBinding $binding
 * @property-read Environment|null $environment
 *
 * @mixin \Eloquent
 */
final class DeviceGrant extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

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

    /**
     * @return array<string, string>
     *
     * @column scopes list<string>
     */
    protected function casts(): array
    {
        return [
            'scopes' => 'array',
            'status' => DeviceGrantStatus::class,
            'code_expires_at' => 'immutable_datetime',
            'grant_expires_at' => 'immutable_datetime',
            'last_polled_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A terminal sign-in's grant for the binding, pending the owner's approval: a nonsecret reference, the next
     * generation of the binding's sign-ins, the key its start came under and the binding's environment.
     */
    public static function create(ProjectBinding $binding, string $codeDigest, string $userCode, string $startKey): self
    {
        $grant = new self();
        $grant->binding_id = $binding->id;
        $grant->reference = ShortReference::withPrefix('TS');
        $grant->generation = self::resolveNextGenerationOf($binding);
        $grant->start_key = $startKey;
        $grant->environment_id = $binding->environment_id;
        $grant->device_code_digest = $codeDigest;
        $grant->user_code = $userCode;
        $grant->scopes = self::SCOPES;
        $grant->status = DeviceGrantStatus::Pending;
        $grant->code_expires_at = CarbonImmutable::now()->addMinutes(self::CODE_MINUTES);
        $grant->save();

        return $grant;
    }

    // ----------[ Mutations ]----------

    /**
     * Gives a pending grant the device code of a start sent again under its key, as the one before never reached the
     * terminal.
     */
    public function restartWith(string $codeDigest): void
    {
        $this->device_code_digest = $codeDigest;
        $this->assertSaved($this->save());
        $this->raise(new DeviceGrantRestarted($this->id));
    }

    public function approveBy(string $userId): void
    {
        $this->approved_by_user_id = $userId;
        $this->status = DeviceGrantStatus::Approved;
        $this->assertSaved($this->save());
        $this->raise(new DeviceGrantApproved($this->id, $userId));
    }

    /**
     * Records a poll; refuses one sooner than POLL_SECONDS_MINIMUM after the last.
     *
     * @throws DeviceGrantRefused
     */
    public function recordPoll(): void
    {
        $now = CarbonImmutable::now();
        $this->assertPollDue($now);

        $this->last_polled_at = $now;
        $this->assertSaved($this->save());
        $this->raise(new DeviceGrantPolled($this->id));
    }

    /**
     * Hands the approved grant to the shell once, by the digest of the grant it receives.
     */
    public function issue(string $digest): void
    {
        $this->grant_digest = $digest;
        $this->grant_expires_at = CarbonImmutable::now()->addHours(self::GRANT_HOURS);
        $this->status = DeviceGrantStatus::Issued;
        $this->assertSaved($this->save());
        $this->raise(new DeviceGrantIssued($this->id));
    }

    public function revoke(): void
    {
        $this->status = DeviceGrantStatus::Revoked;
        $this->assertSaved($this->save());
        $this->raise(new DeviceGrantRevoked($this->id));
    }

    // ----------[ Predicates ]----------

    public function isApproved(): bool
    {
        return $this->status === DeviceGrantStatus::Approved;
    }

    public function isCodeExpired(): bool
    {
        return ! CarbonImmutable::now()->lessThan($this->code_expires_at);
    }

    // ----------[ Calculations ]----------

    /**
     * Where the request stands for the owner at this server time: pending, approved and awaiting collection, issued,
     * expired before approval, or revoked.
     */
    public function approvalStateAt(CarbonImmutable $now): string
    {
        if ($this->status === DeviceGrantStatus::Pending && ! $now->lessThan($this->code_expires_at)) {
            return 'expired';
        }

        return $this->status->value;
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

    // ----------[ Asserts ]----------

    /**
     * Answers what a poll of a grant past its approval gets: the bearer went out once, so a repeated poll learns its
     * reference to withdraw it, and a revoked grant says so.
     *
     * @throws DeviceGrantRefused
     */
    public function assertNotCollected(): void
    {
        if ($this->status === DeviceGrantStatus::Revoked) {
            throw DeviceGrantRefused::revoked((string) $this->reference);
        }

        if ($this->status === DeviceGrantStatus::Issued) {
            throw DeviceGrantRefused::alreadyIssued((string) $this->reference);
        }
    }

    /**
     * Refuses a poll sooner than the interval; it leaves the last poll as it was, so polling fast never moves it on.
     *
     * @throws DeviceGrantRefused
     */
    private function assertPollDue(CarbonImmutable $now): void
    {
        $isTooSoon = $this->last_polled_at !== null
            && $this->last_polled_at->addSeconds(self::POLL_SECONDS_MINIMUM)->isAfter($now);

        if ($isTooSoon) {
            throw DeviceGrantRefused::pollingTooFast();
        }
    }

    // ----------[ Queries ]----------

    /**
     * The grant of this user code, with its binding, for the owner to check.
     */
    public static function findForUserCode(string $code): self
    {
        return self::query()->with([
            'binding',
            'environment',
        ])->withUserCode($code)->firstOrFail();
    }

    /**
     * The grant a start under this key made for the binding, none or one, locked until the transaction ends: a start
     * whose reply was lost finds it again.
     *
     * @return list<self>
     */
    public static function findLockedOfStart(ProjectBinding $binding, string $startKey): array
    {
        return array_values(self::query()->ofBindings([$binding->id])->underStartKey($startKey)
            ->lockForUpdate()->limit(1)->get()->all());
    }

    /**
     * The terminal sign-ins of these bindings, newest first, in one read; a binding has a few shells that asked.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function findListedOfBindings(array $ids): array
    {
        return array_values(self::query()->ofBindings($ids)->newestFirst()
            ->readAll('a binding has a device grant per shell that asked')->get()->all());
    }

    /**
     * The generation the binding's next sign-in gets: one past its newest.
     */
    public static function resolveNextGenerationOf(ProjectBinding $binding): int
    {
        return (int) self::query()->ofBindings([$binding->id])->max('generation') + 1;
    }

    /**
     * The grant of this id, locked until the transaction ends.
     */
    public static function findLockedById(string $id): self
    {
        return self::query()->with('binding')->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * The pending grant of a user code the owner is about to approve, locked until the transaction ends.
     *
     * @throws DeviceGrantRefused
     */
    public static function findLockedPendingByUserCode(string $code): self
    {
        return self::query()
            ->with('binding')
            ->withUserCode($code)
            ->pendingWithLiveCode()
            ->lockForUpdate()
            ->firstOr(DeviceGrantRefused::throwing()->unknownCode());
    }

    /**
     * The grant a shell polls for with its device code, locked until the transaction ends.
     *
     * @throws DeviceGrantRefused
     */
    public static function findLockedByDeviceCode(string $digest): self
    {
        return self::query()
            ->with('binding')
            ->withDeviceCode($digest)
            ->lockForUpdate()
            ->firstOr(DeviceGrantRefused::throwing()->unknownCode());
    }

    /**
     * The issued, unexpired and approved grant of this digest, with its binding.
     *
     * @throws DeviceGrantRefused
     */
    public static function findUsableByDigest(string $digest): self
    {
        return self::query()
            ->with('binding')
            ->withGrantDigest($digest)
            ->usableNow()
            ->firstOr(DeviceGrantRefused::throwing()->notUsable());
    }

    /**
     * The grants of the binding not revoked yet, locked until the transaction ends; a binding has a few shells.
     *
     * @return list<self>
     */
    public static function findLockedLiveOf(ProjectBinding $binding): array
    {
        return array_values(self::query()->ofBindings([$binding->id])
            ->unrevoked()->lockForUpdate()
            ->readAll('a binding has a device grant per shell that asked')->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * The grant of that user code.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withUserCode(Builder $query, string $code): void
    {
        $query->where('user_code', $code);
    }

    /**
     * The grants of the bindings.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function ofBindings(Builder $query, array $ids): void
    {
        $query->whereIn('binding_id', $ids);
    }

    /**
     * The grant asked for under that start key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function underStartKey(Builder $query, string $startKey): void
    {
        $query->where('start_key', $startKey);
    }

    /**
     * The pending grants whose user code has not expired.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pendingWithLiveCode(Builder $query): void
    {
        $query->where('status', DeviceGrantStatus::Pending)->where('code_expires_at', '>', CarbonImmutable::now());
    }

    /**
     * The grant of the device code digest.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withDeviceCode(Builder $query, string $digest): void
    {
        $query->where('device_code_digest', $digest);
    }

    /**
     * The grant of the grant digest.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withGrantDigest(Builder $query, string $digest): void
    {
        $query->where('grant_digest', $digest);
    }

    /**
     * The issued and approved grants not expired whose binding is not revoked.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function usableNow(Builder $query): void
    {
        $query->where('status', DeviceGrantStatus::Issued)
            ->where('grant_expires_at', '>', CarbonImmutable::now())
            ->whereNotNull('approved_by_user_id')
            ->whereHas('binding', fn (Builder $binding) => $binding->unrevoked());
    }

    /**
     * The grants not revoked.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unrevoked(Builder $query): void
    {
        $query->where('status', '!=', DeviceGrantStatus::Revoked);
    }
}

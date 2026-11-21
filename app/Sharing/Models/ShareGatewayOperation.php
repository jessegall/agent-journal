<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Exceptions\GatewayLeaseRefused;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\GatewayOperation;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * One request to open or close the endpoint of a gateway configuration version, claimed by a supervisor run under a
 * lease, bound to the endpoint it opened or closes, and finished with an outcome code; the program itself runs outside
 * every transaction.
 *
 * @property string $id
 * @property string $share_gateway_configuration_id
 * @property int $configuration_version
 * @property string|null $share_gateway_endpoint_id
 * @property int|null $endpoint_version
 * @property GatewayOperationType $type
 * @property string|null $run_id
 * @property string|null $lease_token
 * @property CarbonImmutable|null $lease_ends_at
 * @property GatewayOutcome|null $outcome_code
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['type', 'run_id', 'lease_token', 'lease_ends_at', 'outcome_code'])]
final class ShareGatewayOperation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.share-gateway-operation';

    private const int LEASE_SECONDS = 90;

    private const int LEASE_TOKEN_BYTES = 32;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => GatewayOperationType::class,
            'configuration_version' => 'integer',
            'lease_ends_at' => 'immutable_datetime',
            'outcome_code' => GatewayOutcome::class,
            'endpoint_version' => 'integer',
        ];
    }

    /**
     * An unclaimed request to open or close the endpoint of the configuration at its current version.
     */
    public static function create(ShareGatewayConfiguration $configuration, GatewayOperationType $type): self
    {
        $operation = new self();
        $operation->share_gateway_configuration_id = $configuration->id;
        $operation->configuration_version = $configuration->configuration_version;
        $operation->type = $type;
        $operation->save();

        return $operation;
    }

    // ----------[ Queries ]----------

    /**
     * The id of the oldest operation no run holds now: never claimed, or claimed under a lease that ran out without an
     * outcome.
     *
     * @return Option<string>
     */
    public static function nextClaimable(): Option
    {
        return Option::fromValue(self::query()->claimable()->orderBy('id')->value('id'))->map(strval(...));
    }

    /**
     * Whether an open of the configuration's endpoint waits or runs without an outcome yet.
     */
    public static function hasUnfinishedOpenFor(ShareGatewayConfiguration $configuration): bool
    {
        return self::query()->unfinished()->ofConfiguration($configuration->id)->ofType(
            GatewayOperationType::Open,
        )->exists();
    }

    /**
     * The operation of this id, read without a lock to learn which configuration to lock first.
     *
     * @throws GatewayLeaseRefused
     */
    public static function of(string $id): self
    {
        return self::query()->whereKey($id)->firstOr(fn () => throw GatewayLeaseRefused::forOperation($id));
    }

    /**
     * The operation of this id, locked until the transaction ends.
     */
    public static function lockById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Mutations ]----------

    /**
     * The run claims the operation for the endpoint under a new random lease token for 90 seconds, and gets what it
     * carries the operation out under.
     */
    public function claimFor(
        string $runId,
        ShareGatewayEndpoint $endpoint,
        GatewayConfiguration $configuration,
    ): GatewayOperation {
        $leaseToken = bin2hex(random_bytes(self::LEASE_TOKEN_BYTES));
        $leaseEndsAt = CarbonImmutable::now()->addSeconds(self::LEASE_SECONDS);
        $this->run_id = $runId;
        $this->share_gateway_endpoint_id = $endpoint->id;
        $this->endpoint_version = $endpoint->endpoint_version;
        $this->lease_token = $leaseToken;
        $this->lease_ends_at = $leaseEndsAt;
        $this->save();

        return new GatewayOperation(
            $this->id,
            $runId,
            $endpoint->endpoint_version,
            $leaseToken,
            $leaseEndsAt->getTimestamp(),
            $configuration,
        );
    }

    public function finish(GatewayOutcome $outcome): void
    {
        $this->outcome_code = $outcome;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * Whether no run holds the operation now and it has no outcome.
     */
    public function isClaimable(): bool
    {
        return $this->outcome_code === null
            && ($this->run_id === null || $this->lease_ends_at === null || ! $this->lease_ends_at->isFuture());
    }

    /**
     * Whether the run holds the operation for this endpoint version under this lease token, whatever its deadline.
     */
    public function isHeldBy(string $runId, int $endpointVersion, string $leaseToken): bool
    {
        return $this->run_id === $runId
            && $this->endpoint_version === $endpointVersion
            && $this->lease_token !== null
            && hash_equals($this->lease_token, $leaseToken);
    }

    public function leaseIsLive(): bool
    {
        return $this->lease_ends_at !== null && $this->lease_ends_at->isFuture();
    }

    public function hasOutcome(): bool
    {
        return $this->outcome_code !== null;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function claimable(Builder $query): void
    {
        $query->unfinished()->where(
            fn (Builder $query) => $query->whereNull('lease_ends_at')->orWhere(
                'lease_ends_at',
                '<=',
                CarbonImmutable::now(),
            ),
        );
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unfinished(Builder $query): void
    {
        $query->whereNull('outcome_code');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofConfiguration(Builder $query, string $configurationId): void
    {
        $query->where('share_gateway_configuration_id', $configurationId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofType(Builder $query, GatewayOperationType $type): void
    {
        $query->where('type', $type->value);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function claimedByOtherThan(Builder $query, string $runId): void
    {
        $query->whereNotNull('run_id')->where('run_id', '!=', $runId);
    }
}

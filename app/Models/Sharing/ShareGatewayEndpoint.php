<?php

declare(strict_types=1);

namespace App\Models\Sharing;

use App\Concerns\OrdersById;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\GatewayEndpointState;
use App\Events\Sharing\ShareGatewayEndpointFoundHealthy;
use App\Events\Sharing\ShareGatewayEndpointMoved;
use App\Exceptions\GatewayLeaseRefused;
use App\Support\GatewayEndpoint;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * One numbered attempt of a gateway configuration to serve its public origin, owned by one supervisor run; it serves
 * every share made under that configuration.
 *
 * @property string $id
 * @property string $share_gateway_configuration_id
 * @property int $endpoint_version
 * @property string $run_id
 * @property string $public_origin
 * @property GatewayEndpointState $state
 * @property CarbonImmutable|null $last_health_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['endpoint_version', 'run_id', 'public_origin', 'state', 'last_health_at'])]
final class ShareGatewayEndpoint extends Model implements EventSource, ReadableModel
{
    use OrdersById;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'core.share-gateway-endpoint';

    /**
     * How long after its last healthy report an endpoint still counts as healthy.
     */
    private const int HEALTHY_SECONDS = 45;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'endpoint_version' => 'integer',
            'state' => GatewayEndpointState::class,
            'last_health_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new endpoint version of the configuration, opening under the run on the configuration's public origin.
     */
    public static function create(ShareGatewayConfiguration $configuration, int $version, string $runId): self
    {
        $endpoint = new self();
        $endpoint->share_gateway_configuration_id = $configuration->id;
        $endpoint->endpoint_version = $version;
        $endpoint->run_id = $runId;
        $endpoint->public_origin = $configuration->settings->publicOrigin;
        $endpoint->state = GatewayEndpointState::Opening;
        $endpoint->save();

        return $endpoint;
    }

    // ----------[ Mutations ]----------

    public function moveTo(GatewayEndpointState $state): void
    {
        $this->state = $state;
        $this->assertSaved($this->save());
        $this->raise(new ShareGatewayEndpointMoved($this->id, $state));
    }

    /**
     * Notes a healthy report; an unhealthy one leaves the last healthy time to age.
     */
    public function recordHealthy(): void
    {
        $this->last_health_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new ShareGatewayEndpointFoundHealthy($this->id));
    }

    // ----------[ Getters ]----------

    /**
     * The key of the gateway this endpoint's configuration uses.
     */
    public function gatewayKey(): string
    {
        return ShareGatewayConfiguration::query()->findOrFail($this->share_gateway_configuration_id)->gateway_key;
    }

    /**
     * Whether the endpoint answered a health check within the last 45 seconds.
     */
    public function isHealthy(): bool
    {
        return $this->last_health_at !== null && $this->last_health_at->isAfter(
            CarbonImmutable::now()->subSeconds(self::HEALTHY_SECONDS),
        );
    }

    public function isVersion(int $version): bool
    {
        return $this->endpoint_version === $version;
    }

    // ----------[ Accessors ]----------

    /**
     * The endpoint as its gateway knows it: run, version, public origin and the reference its program is kept under.
     *
     * @return Attribute<GatewayEndpoint, never>
     */
    protected function toGatewayEndpoint(): Attribute
    {
        return Attribute::get(fn () => new GatewayEndpoint(
            $this->run_id,
            $this->endpoint_version,
            $this->public_origin,
            GatewayEndpoint::referenceOf($this->run_id, $this->endpoint_version),
        ))->withoutObjectCaching();
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an endpoint version the run does not hold.
     *
     * @phpstan-assert self $row
     *
     * @throws GatewayLeaseRefused
     */
    private static function assertHeld(self|null $row, string $configurationId, int $version): void
    {
        if ($row === null) {
            throw GatewayLeaseRefused::forEndpoint($configurationId, $version);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The run's running endpoint of the configuration, newest version first and locked, if it has one.
     *
     * @return Option<self>
     */
    public static function lockRunningOf(ShareGatewayConfiguration $configuration, string $runId): Option
    {
        $endpoint = self::query()->ofConfiguration($configuration->id)->ofRun($runId)->stillRunning()
            ->newestVersionFirst()->lockForUpdate()->first();

        return Option::fromValue($endpoint);
    }

    /**
     * The newest opening or open endpoint version of the configuration, under any run, if it has one.
     *
     * @return Option<self>
     */
    public static function newestRunningOf(ShareGatewayConfiguration $configuration): Option
    {
        $endpoint = self::query()->ofConfiguration($configuration->id)->stillRunning()->newestVersionFirst()->first();

        return Option::fromValue($endpoint);
    }

    /**
     * The run's open endpoints, whose health its supervisor checks.
     *
     * @return list<self>
     */
    public static function openOfRun(string $runId): array
    {
        return array_values(
            self::query()->ofRun($runId)->open()->oldestFirst()->limit(Share::LIVE_LIMIT)->get()->all(),
        );
    }

    /**
     * Whether any endpoint version of the configuration is opening or open, under any run.
     */
    public static function hasAnyRunningOf(ShareGatewayConfiguration $configuration): bool
    {
        return self::query()->ofConfiguration($configuration->id)->stillRunning()->exists();
    }

    /**
     * A new endpoint version of the configuration for the run, after every version it had; a closing version is never
     * opened again.
     */
    public static function openNextFor(ShareGatewayConfiguration $configuration, string $runId): self
    {
        $latest = self::query()->ofConfiguration($configuration->id)->max('endpoint_version');

        return self::create($configuration, (is_numeric($latest) ? (int) $latest : 0) + 1, $runId);
    }

    /**
     * The endpoint of this id, locked until the transaction ends.
     */
    public static function lockById(string $id): self
    {
        return self::lockedById($id);
    }

    /**
     * The endpoint version of the configuration, locked, while the run holds it.
     *
     * @throws GatewayLeaseRefused
     */
    public static function lockHeldBy(string $configurationId, int $version, string $runId): self
    {
        $row = self::query()
            ->ofConfiguration($configurationId)
            ->atVersion($version)
            ->ofRun($runId)
            ->lockForUpdate()
            ->first();
        self::assertHeld($row, $configurationId, $version);

        return $row;
    }

    // ----------[ Scopes ]----------

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
    protected function ofRun(Builder $query, string $runId): void
    {
        $query->where('run_id', $runId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function notOfRun(Builder $query, string $runId): void
    {
        $query->where('run_id', '!=', $runId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function stillRunning(Builder $query): void
    {
        $query->whereIn('state', [GatewayEndpointState::Opening->value, GatewayEndpointState::Open->value]);
    }

    /**
     * The endpoints newest version first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestVersionFirst(Builder $query): void
    {
        $query->orderByDesc('endpoint_version');
    }

    /**
     * The open endpoints.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function open(Builder $query): void
    {
        $query->where('state', GatewayEndpointState::Open->value);
    }

    /**
     * The endpoint of that version.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function atVersion(Builder $query, int $version): void
    {
        $query->where('endpoint_version', $version);
    }
}

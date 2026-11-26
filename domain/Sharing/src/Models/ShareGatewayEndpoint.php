<?php

declare(strict_types=1);

namespace Domain\Sharing\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Support\GatewayEndpoint;
use Carbon\CarbonImmutable;
use Domain\Sharing\Enums\GatewayEndpointStatus;
use Domain\Sharing\Events\ShareGatewayEndpointFoundHealthy;
use Domain\Sharing\Events\ShareGatewayEndpointMoved;
use Domain\Sharing\Exceptions\GatewayLeaseRefused;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $share_gateway_configuration_id
 * @property int $endpoint_version
 * @property string $run_id
 * @property string $public_origin
 * @property GatewayEndpointStatus $status
 * @property CarbonImmutable|null $last_health_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $to_gateway_endpoint
 *
 * @mixin \Eloquent
 */
final class ShareGatewayEndpoint extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

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
            'status' => GatewayEndpointStatus::class,
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
        $endpoint->status = GatewayEndpointStatus::Opening;
        $endpoint->save();

        return $endpoint;
    }

    /**
     * A new endpoint version of the configuration for the run, after every version it had; a closing version is never
     * opened again.
     */
    public static function createForConfiguration(ShareGatewayConfiguration $configuration, string $runId): self
    {
        return self::create($configuration, self::resolveNextVersion($configuration), $runId);
    }

    // ----------[ Mutations ]----------

    public function moveTo(GatewayEndpointStatus $status): void
    {
        $this->status = $status;
        $this->assertSaved($this->save());
        $this->raise(new ShareGatewayEndpointMoved($this->id, $status));
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

    // ----------[ Predicates ]----------

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

    // ----------[ Calculations ]----------

    /**
     * The key of the gateway this endpoint's configuration uses.
     */
    public function gatewayKey(): string
    {
        return ShareGatewayConfiguration::query()->findOrFail($this->share_gateway_configuration_id)->gateway_key;
    }

    // ----------[ Accessors ]----------

    /**
     * The endpoint as its gateway knows it: run, version, public origin and the reference its program is kept under.
     *
     * @return Attribute<GatewayEndpoint, never>
     */
    protected function toGatewayEndpoint(): Attribute
    {
        return Accessor::get(fn () => new GatewayEndpoint(
            $this->run_id,
            $this->endpoint_version,
            $this->public_origin,
            GatewayEndpoint::referenceOf($this->run_id, $this->endpoint_version),
        ));
    }

    // ----------[ Queries ]----------

    /**
     * The run's running endpoint of the configuration, newest version first and locked, if it has one.
     *
     * @return Option<self>
     */
    public static function findLockedRunningOf(ShareGatewayConfiguration $configuration, string $runId): Option
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
    public static function findNewestRunningOf(ShareGatewayConfiguration $configuration): Option
    {
        $endpoint = self::query()->ofConfiguration($configuration->id)->stillRunning()->newestVersionFirst()->first();

        return Option::fromValue($endpoint);
    }

    /**
     * The run's open endpoints, whose health its supervisor checks.
     *
     * @return list<self>
     */
    public static function findOpenOfRun(string $runId): array
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
     * The endpoint version of the configuration, locked, while the run holds it.
     *
     * @throws GatewayLeaseRefused
     */
    public static function findLockedHeldBy(string $configurationId, int $version, string $runId): self
    {
        return self::query()
            ->ofConfiguration($configurationId)
            ->atVersion($version)
            ->ofRun($runId)
            ->lockForUpdate()->firstOr(GatewayLeaseRefused::throwing()->forEndpoint($configurationId, $version));
    }

    /**
     * The version the configuration's next endpoint takes: one past its newest.
     */
    public static function resolveNextVersion(ShareGatewayConfiguration $configuration): int
    {
        return (int) self::query()->ofConfiguration($configuration->id)->max('endpoint_version') + 1;
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
        $query->whereIn('status', [GatewayEndpointStatus::Opening->value, GatewayEndpointStatus::Open->value]);
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
        $query->where('status', GatewayEndpointStatus::Open->value);
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

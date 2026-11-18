<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Sharing\Enums\GatewayEndpointState;
use App\Sharing\Exceptions\GatewayLeaseRefused;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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
final class ShareGatewayEndpoint extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.share-gateway-endpoint';

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

    /**
     * A new endpoint version of the configuration, opening under the run on the configuration's public origin.
     */
    public static function openFor(ShareGatewayConfiguration $configuration, int $endpointVersion, string $runId): self
    {
        $endpoint = new self();
        $endpoint->share_gateway_configuration_id = $configuration->id;
        $endpoint->endpoint_version = $endpointVersion;
        $endpoint->run_id = $runId;
        $endpoint->public_origin = $configuration->settings->publicOrigin;
        $endpoint->state = GatewayEndpointState::Opening;
        $endpoint->save();

        return $endpoint;
    }

    /**
     * Counts every endpoint another run opened as stopped: a new run never adopts a process it did not start.
     */
    public static function stopAllButRun(string $runId): void
    {
        self::query()->notOfRun($runId)->stillRunning()->update(['state' => GatewayEndpointState::Closed->value]);
    }

    /**
     * The run's running endpoint of the configuration, newest version first and locked, if it has one.
     *
     * @return Option<self>
     */
    public static function lockRunningOf(ShareGatewayConfiguration $configuration, string $runId): Option
    {
        return Option::fromValue(self::query()->ofConfiguration($configuration->id)->ofRun($runId)->stillRunning()->orderByDesc('endpoint_version')->lockForUpdate()->first());
    }

    /**
     * Whether any endpoint version of the configuration is opening or open, under any run.
     */
    public static function anyRunningOf(ShareGatewayConfiguration $configuration): bool
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

        return self::openFor($configuration, (is_numeric($latest) ? (int) $latest : 0) + 1, $runId);
    }

    /**
     * The endpoint of this id, locked until the transaction ends.
     */
    public static function lockById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * The endpoint version of the configuration, locked, while the run holds it.
     *
     * @throws GatewayLeaseRefused
     */
    public static function lockHeldBy(string $configurationId, int $endpointVersion, string $runId): self
    {
        return self::query()->ofConfiguration($configurationId)->where('endpoint_version', $endpointVersion)->ofRun($runId)->lockForUpdate()->first()
            ?? throw GatewayLeaseRefused::forEndpoint($configurationId, $endpointVersion);
    }

    public function isVersion(int $endpointVersion): bool
    {
        return $this->endpoint_version === $endpointVersion;
    }

    public function moveTo(GatewayEndpointState $state): void
    {
        $this->state = $state;
        $this->save();
    }

    /**
     * Notes a healthy report; an unhealthy one leaves the last healthy time to age.
     */
    public function recordHealthy(): void
    {
        $this->last_health_at = CarbonImmutable::now();
        $this->save();
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
}

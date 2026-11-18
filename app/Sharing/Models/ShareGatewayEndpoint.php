<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Sharing\Enums\GatewayEndpointState;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

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
        $endpoint = new self;
        $endpoint->share_gateway_configuration_id = $configuration->id;
        $endpoint->endpoint_version = $endpointVersion;
        $endpoint->run_id = $runId;
        $endpoint->public_origin = $configuration->settings->publicOrigin;
        $endpoint->state = GatewayEndpointState::Opening;
        $endpoint->save();

        return $endpoint;
    }
}

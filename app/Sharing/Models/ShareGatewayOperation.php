<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Sharing\Enums\GatewayOperationType;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One request to open or close an endpoint, claimed by a supervisor run under a lease and finished with an outcome
 * code; the program itself runs outside every transaction.
 *
 * @property string $id
 * @property string $share_gateway_endpoint_id
 * @property GatewayOperationType $type
 * @property string|null $run_id
 * @property string|null $lease_token
 * @property CarbonImmutable|null $lease_ends_at
 * @property string|null $outcome_code
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['type', 'run_id', 'lease_token', 'lease_ends_at', 'outcome_code'])]
final class ShareGatewayOperation extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.share-gateway-operation';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => GatewayOperationType::class,
            'lease_ends_at' => 'immutable_datetime',
        ];
    }

    /**
     * An unclaimed request to open or close the endpoint.
     */
    public static function request(ShareGatewayEndpoint $endpoint, GatewayOperationType $type): self
    {
        $operation = new self;
        $operation->share_gateway_endpoint_id = $endpoint->id;
        $operation->type = $type;
        $operation->save();

        return $operation;
    }
}

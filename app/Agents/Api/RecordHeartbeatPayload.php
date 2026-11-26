<?php

declare(strict_types=1);

namespace App\Agents\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use App\Values\ApiAccepted;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Records that the calling agent's session is alive.
 *
 * @implements ApiPayload<ApiAccepted>
 */
#[Endpoint('heartbeat', 'POST', ApiAccepted::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RecordHeartbeatPayload extends Data implements ApiPayload
{
    public function __construct(
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

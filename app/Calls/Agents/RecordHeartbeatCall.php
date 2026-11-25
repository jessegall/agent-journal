<?php

declare(strict_types=1);

namespace App\Calls\Agents;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use App\Values\CallAccepted;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Records that the calling agent's session is alive.
 *
 * @implements JournalCall<CallAccepted>
 */
#[Endpoint('heartbeat', 'POST', CallAccepted::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RecordHeartbeatCall extends Data implements JournalCall
{
    public function __construct(
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

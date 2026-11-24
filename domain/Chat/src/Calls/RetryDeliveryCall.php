<?php

declare(strict_types=1);

namespace Domain\Chat\Calls;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use App\Values\CallAccepted;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * An operator asks again for one given-up piece of chat text, under its own notification key.
 *
 * @implements JournalCall<CallAccepted>
 */
#[Endpoint('chat/deliveries/retry', 'POST', CallAccepted::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RetryDeliveryCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public string $range,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

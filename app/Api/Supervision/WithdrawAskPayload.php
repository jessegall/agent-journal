<?php

declare(strict_types=1);

namespace App\Api\Supervision;

use App\Asks\Data\AskCard;
use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;

/**
 * @implements ApiPayload<AskCard>
 */
#[Endpoint('asks/withdraw', 'POST', AskCard::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class WithdrawAskPayload extends Data implements ApiPayload
{
    public function __construct(
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        #[Ulid]
        public readonly string $id,
    ) {}
}

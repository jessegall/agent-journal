<?php

declare(strict_types=1);

namespace App\Api\Api\Supervision;

use App\Asks\Data\AskCard;
use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use App\Values\AskTypeKey;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;

/**
 * @implements ApiPayload<AskCard>
 */
#[Endpoint('asks/make', 'POST', AskCard::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class MakeAskPayload extends Data implements ApiPayload
{
    public function __construct(
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        #[Max(16000)]
        public readonly string $body,
        public readonly string|null $type = null,
    ) {}

    public function typeKey(): AskTypeKey|null
    {
        if ($this->type === null) {
            return null;
        }

        return AskTypeKey::of($this->type);
    }
}

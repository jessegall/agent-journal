<?php

declare(strict_types=1);

namespace Domain\Helpers\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Helpers\Data\HelperSteerData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Adds steering to a helper's live job, or keeps it when none is live.
 *
 * @implements ApiPayload<HelperSteerData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('helpers/steer', 'POST', HelperSteerData::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class SteerHelperPayload extends Data implements ApiPayload
{
    public function __construct(
        public string $identityId,
        public string $text,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

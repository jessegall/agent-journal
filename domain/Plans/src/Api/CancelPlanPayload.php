<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Cancels a plan, as the revision its caller read, with its reason.
 *
 * @implements ApiPayload<PlanNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/cancel', 'POST', PlanNamed::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class CancelPlanPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Ulid]
        public string $planId,
        #[Min(1)]
        public int $expectedRevision,
        #[Max(8000)]
        public string $reason,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

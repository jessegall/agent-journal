<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Plans\Enums\PlanType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Drafts a new plan.
 *
 * @implements ApiPayload<PlanNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/create', 'POST', PlanNamed::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class CreatePlanPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(240)]
        public readonly string $title,
        #[Max(8000)]
        public readonly string $brief,
        public readonly PlanType $type,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}

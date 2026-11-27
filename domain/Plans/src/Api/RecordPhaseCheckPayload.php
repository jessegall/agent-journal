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
use Domain\Plans\Api\Concerns\NamesPlanPhase;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Records a check of a phase under the result receipt that proves it.
 *
 * @implements ApiPayload<PhaseCheckRecorded>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/phases/check', 'POST', PhaseCheckRecorded::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RecordPhaseCheckPayload extends Data implements ApiPayload
{
    use NamesPlanPhase;

    public function __construct(
        #[Min(1)]
        public readonly int $plan,
        #[Min(1)]
        public readonly int $phase,
        #[Max(26)]
        public readonly string $receipt,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}

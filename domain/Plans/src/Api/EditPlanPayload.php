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
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\RequiredWithoutAll;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Changes the title, brief or type of a plan, as the revision its caller read.
 *
 * @implements ApiPayload<PlanEdited>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/edit', 'POST', PlanEdited::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class EditPlanPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Ulid]
        public string $planId,
        #[Min(1)]
        public int $expectedRevision,
        #[Max(240), RequiredWithoutAll('brief', 'type')]
        public string|null $title,
        #[Max(8000)]
        public string|null $brief,
        public PlanType|null $type,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

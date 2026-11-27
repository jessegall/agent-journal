<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use App\Api\Assignments\Concerns\NamesExpectedAssignment;
use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Plans\Api\Concerns\NamesPlanWorkRoot;
use Domain\Plans\Data\PlanWorkResultData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Takes a plan or phase and its unfinished work from the holder its caller read.
 *
 * @implements ApiPayload<PlanWorkResultData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/work/unassign', 'POST', PlanWorkResultData::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class UnassignPlanWorkPayload extends Data implements ApiPayload
{
    use NamesExpectedAssignment;
    use NamesPlanWorkRoot;

    public function __construct(
        #[In('plans.plan', 'plans.phase')]
        public readonly string $rootType,
        #[Max(40)]
        public readonly string $rootId,
        #[Ulid]
        public readonly string $assignmentId,
        public readonly string $holderType,
        #[Ulid]
        public readonly string $holderId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        #[Max(20)]
        public readonly string|null $rootPlan = null,
    ) {}
}

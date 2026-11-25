<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use App\Api\Assignments\Concerns\NamesExpectedAssignment;
use App\Api\Assignments\Concerns\NamesRecipient;
use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
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
 * Moves a plan or phase and its unfinished work from the holder its caller read to a new one.
 *
 * @implements ApiPayload<PlanWorkResultData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/work/reassign', 'POST', PlanWorkResultData::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class ReassignPlanWorkPayload extends Data implements ApiPayload
{
    use NamesExpectedAssignment;
    use NamesPlanWorkRoot;
    use NamesRecipient;

    public function __construct(
        #[In('plans.plan', 'plans.phase')]
        public string $rootType,
        #[Max(40)]
        public string $rootId,
        #[Ulid]
        public string $assignmentId,
        public string $holderType,
        #[Ulid]
        public string $holderId,
        public string $recipientType,
        #[Ulid]
        public string $recipientId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
        #[Max(20)]
        public string|null $rootPlan = null,
    ) {}
}

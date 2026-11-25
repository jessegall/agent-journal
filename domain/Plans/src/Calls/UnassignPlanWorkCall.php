<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

use App\Attributes\Api\Endpoint;
use App\Calls\Assignments\Concerns\NamesExpectedAssignment;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Plans\Calls\Concerns\NamesPlanWorkRoot;
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
 * @implements JournalCall<PlanWorkResultData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/work/unassign', 'POST', PlanWorkResultData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class UnassignPlanWorkCall extends Data implements JournalCall
{
    use NamesExpectedAssignment;
    use NamesPlanWorkRoot;

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
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
        #[Max(20)]
        public string|null $rootPlan = null,
    ) {}
}

<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

use App\Actors\Enums\ActorType;
use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use App\Assignments\Calls\Concerns\NamesExpectedAssignment;
use Domain\Plans\Calls\Concerns\NamesPlanWorkRoot;
use Domain\Plans\Http\Data\PlanWorkResultData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\In;
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
        #[Ulid]
        public string $rootId,
        #[Ulid]
        public string $assignmentId,
        public ActorType $holderType,
        #[Ulid]
        public string $holderId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

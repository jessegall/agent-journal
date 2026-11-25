<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

use App\Attributes\Endpoint;
use App\Calls\Assignments\Concerns\NamesExpectedAssignment;
use App\Calls\Assignments\Concerns\NamesRecipient;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\Assignments\ActorType;
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
 * Moves a plan or phase and its unfinished work from the holder its caller read to a new one.
 *
 * @implements JournalCall<PlanWorkResultData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/work/reassign', 'POST', PlanWorkResultData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class ReassignPlanWorkCall extends Data implements JournalCall
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
        public ActorType $holderType,
        #[Ulid]
        public string $holderId,
        public ActorType $recipientType,
        #[Ulid]
        public string $recipientId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
        #[Max(20)]
        public string|null $rootPlan = null,
    ) {}
}

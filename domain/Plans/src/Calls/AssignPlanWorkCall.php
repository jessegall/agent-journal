<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

use App\Attributes\Endpoint;
use App\Calls\Assignments\Concerns\NamesRecipient;
use App\Casts\CallKeyCast;
use App\Contracts\JournalCall;
use App\Enums\ActorType;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
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
 * Hands a plan or phase and its unfinished work to a holder.
 *
 * @implements JournalCall<PlanWorkResultData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/work/assign', 'POST', PlanWorkResultData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class AssignPlanWorkCall extends Data implements JournalCall
{
    use NamesPlanWorkRoot;
    use NamesRecipient;

    public function __construct(
        #[In('plans.plan', 'plans.phase')]
        public string $rootType,
        #[Max(40)]
        public string $rootId,
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

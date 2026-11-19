<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
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
 * @implements JournalCall<PlanEdited>
 */
#[Endpoint('plans/edit', 'POST', PlanEdited::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
#[MapName(SnakeCaseMapper::class)]
final class EditPlanCall extends Data implements JournalCall
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
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}

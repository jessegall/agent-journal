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
use Domain\Plans\Calls\Concerns\NamesPlanPhase;
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
 * @implements JournalCall<PhaseCheckRecorded>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/phases/check', 'POST', PhaseCheckRecorded::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RecordPhaseCheckCall extends Data implements JournalCall
{
    use NamesPlanPhase;

    public function __construct(
        #[Min(1)]
        public int $plan,
        #[Min(1)]
        public int $phase,
        #[Max(26)]
        public string $receipt,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

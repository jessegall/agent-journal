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
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Adds a phase at the end of a plan.
 *
 * @implements JournalCall<PhaseNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/phases/create', 'POST', PhaseNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class AddPhaseCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public string $planId,
        #[Max(240)]
        public string $title,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

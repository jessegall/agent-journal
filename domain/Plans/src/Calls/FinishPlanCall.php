<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Finishes a plan, as the revision its caller read, with its note.
 *
 * @implements JournalCall<PlanNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('plans/finish', 'POST', PlanNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class FinishPlanCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public string $planId,
        #[Min(1)]
        public int $expectedRevision,
        #[Max(8000)]
        public string $note,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

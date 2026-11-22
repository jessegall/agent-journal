<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Casts\CallKeyCast;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Retires a classification rule against the active revision read.
 *
 * @implements JournalCall<RuleRetired>
 */
#[Endpoint(
    'processes/rules/{rule}/retire',
    'POST',
    RuleRetired::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class RetireRuleCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameter('rule')]
        public string $rule,
        #[MapName('expected_revision'), Min(0)]
        public int $expectedRevision,
        #[Max(2000)]
        public string $reason,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

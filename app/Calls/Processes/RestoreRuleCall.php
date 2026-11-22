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
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Proposes an earlier revision of a classification rule again; the request key makes a retry the same proposal.
 *
 * @implements JournalCall<ProposalReceived>
 */
#[Endpoint(
    'processes/rules/{rule}/restore',
    'POST',
    ProposalReceived::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class RestoreRuleCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameter('rule')]
        public string $rule,
        #[MapName('from_revision'), Min(1)]
        public int $fromRevision,
        #[MapName('expected_revision'), Min(0)]
        public int $expectedRevision,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\InPath;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
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
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}

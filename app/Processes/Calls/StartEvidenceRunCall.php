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
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Starts the evidence run an owner's permit allows, once per request key: the same key answers the same run.
 *
 * @implements JournalCall<EvidenceRunStarted>
 */
#[Endpoint(
    'processes/permits/{evidencePermit}/runs',
    'POST',
    EvidenceRunStarted::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::Operation,
)]
final class StartEvidenceRunCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('evidencePermit', 'id')]
        public string $evidencePermit,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}

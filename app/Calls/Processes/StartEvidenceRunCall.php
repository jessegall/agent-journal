<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
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
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

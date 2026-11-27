<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
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
 * @implements ApiPayload<EvidenceRunStarted>
 */
#[Endpoint(
    'processes/permits/{evidencePermit}/runs',
    'POST',
    EvidenceRunStarted::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::Operation,
)]
final class StartEvidenceRunPayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('evidencePermit', 'id')]
        public readonly string $evidencePermit,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}

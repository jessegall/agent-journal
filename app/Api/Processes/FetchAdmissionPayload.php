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
 * Takes an admitted run's execution material once: the run keeps the key it was consumed under, so the same key gets
 * the same material again and another key learns only that the run started.
 *
 * @implements ApiPayload<AdmissionFetched>
 */
#[Endpoint(
    'processes/admissions/{processRun}',
    'POST',
    AdmissionFetched::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::Operation,
)]
final class FetchAdmissionPayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public readonly string $processRun,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
    ) {}
}

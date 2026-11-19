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
 * Takes an admitted run's execution material once: the run keeps the key it was consumed under, so the same key gets
 * the same material again and another key learns only that the run started.
 *
 * @implements JournalCall<AdmissionFetched>
 */
#[Endpoint(
    'processes/admissions/{processRun}',
    'POST',
    AdmissionFetched::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::Operation,
)]
final class FetchAdmissionCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public string $processRun,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}

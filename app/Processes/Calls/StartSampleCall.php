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
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Starts a held command's sample run under its permit, once per request key.
 *
 * @implements JournalCall<SampleStarted>
 */
#[Endpoint(
    'processes/requests/{commandRequest}/samples',
    'POST',
    SampleStarted::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class StartSampleCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameter('commandRequest')]
        public string $commandRequest,
        #[Max(64)]
        public string $permit,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

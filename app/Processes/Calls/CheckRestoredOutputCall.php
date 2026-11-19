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
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Checks a run's restored output against what was recorded, part by part.
 *
 * @implements JournalCall<RestoreChecked>
 */
#[Endpoint(
    'processes/runs/{processRun}/restore-check',
    'POST',
    RestoreChecked::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class CheckRestoredOutputCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameter('processRun')]
        public string $processRun,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}

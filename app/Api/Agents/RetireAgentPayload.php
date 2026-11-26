<?php

declare(strict_types=1);

namespace App\Api\Agents;

use App\Assignments\Data\AssignmentResultData;
use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Retires the named agent for good, releasing everything it held; the caller is never the subject.
 *
 * @implements ApiPayload<AssignmentResultData>
 */
#[Endpoint('agents/retire', 'POST', AssignmentResultData::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RetireAgentPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Ulid]
        public string $agentId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

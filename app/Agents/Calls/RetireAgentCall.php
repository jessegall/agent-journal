<?php

declare(strict_types=1);

namespace App\Agents\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use App\Http\Data\Assignments\AssignmentResultData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Retires the named agent for good, releasing everything it held; the caller is never the subject.
 *
 * @implements JournalCall<AssignmentResultData>
 */
#[Endpoint('agents/retire', 'POST', AssignmentResultData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RetireAgentCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public string $agentId,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Sharing\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use App\Http\Data\Sharing\ShareProposalStatusData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Proposes sharing a record; its owner approves it. The request key keeps a retry one proposal.
 *
 * @implements JournalCall<ShareProposalStatusData>
 */
#[Endpoint('sharing/request', 'POST', ShareProposalStatusData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RequestShareCall extends Data implements JournalCall
{
    public function __construct(
        #[Regex('/^[a-z][a-z-]*$/')]
        public string $alias,
        #[Regex('/^[1-9][0-9]{0,18}$/')]
        public string $number,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

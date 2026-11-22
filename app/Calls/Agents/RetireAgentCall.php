<?php

declare(strict_types=1);

namespace App\Calls\Agents;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\JournalCall;
use App\Data\Assignments\AssignmentResultData;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
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
 * @implements JournalCall<AssignmentResultData>
 */
#[Endpoint('agents/retire', 'POST', AssignmentResultData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class RetireAgentCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public string $agentId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

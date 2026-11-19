<?php

declare(strict_types=1);

namespace App\Assignments\Calls;

use App\Actors\Enums\ActorType;
use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use App\Assignments\Calls\Concerns\NamesAssignedRecord;
use App\Assignments\Calls\Concerns\NamesRecipient;
use App\Http\Data\Assignments\AssignmentResultData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Hands an unheld record to a holder.
 *
 * @implements JournalCall<AssignmentResultData>
 */
#[Endpoint('assignments/assign', 'POST', AssignmentResultData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class AssignRecordCall extends Data implements JournalCall
{
    use NamesAssignedRecord;
    use NamesRecipient;

    public function __construct(
        #[Max(100)]
        public string $recordType,
        #[Ulid]
        public string $recordId,
        public ActorType $recipientType,
        #[Ulid]
        public string $recipientId,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}

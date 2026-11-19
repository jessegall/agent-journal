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
use App\Assignments\Calls\Concerns\NamesExpectedAssignment;
use App\Http\Data\Assignments\AssignmentResultData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Takes a record from the holder its caller read.
 *
 * @implements JournalCall<AssignmentResultData>
 */
#[Endpoint(
    'assignments/unassign',
    'POST',
    AssignmentResultData::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class UnassignRecordCall extends Data implements JournalCall
{
    use NamesAssignedRecord;
    use NamesExpectedAssignment;

    public function __construct(
        #[Max(100)]
        public string $recordType,
        #[Ulid]
        public string $recordId,
        #[Ulid]
        public string $assignmentId,
        public ActorType $holderType,
        #[Ulid]
        public string $holderId,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}

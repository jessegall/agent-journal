<?php

declare(strict_types=1);

namespace App\Calls\Assignments;

use App\Attributes\Endpoint;
use App\Calls\Assignments\Concerns\NamesAssignedRecord;
use App\Calls\Assignments\Concerns\NamesExpectedAssignment;
use App\Calls\Assignments\Concerns\NamesRecipient;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Data\Assignments\AssignmentResultData;
use App\Enums\ActorType;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Moves a record from the holder its caller read to a new one.
 *
 * @implements JournalCall<AssignmentResultData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint(
    'assignments/reassign',
    'POST',
    AssignmentResultData::class,
    CallEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class ReassignRecordCall extends Data implements JournalCall
{
    use NamesAssignedRecord;
    use NamesExpectedAssignment;
    use NamesRecipient;

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
        public ActorType $recipientType,
        #[Ulid]
        public string $recipientId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

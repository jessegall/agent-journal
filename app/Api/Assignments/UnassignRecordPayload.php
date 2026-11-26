<?php

declare(strict_types=1);

namespace App\Api\Assignments;

use App\Api\Assignments\Concerns\NamesAssignedRecord;
use App\Api\Assignments\Concerns\NamesExpectedAssignment;
use App\Assignments\Data\AssignmentResultData;
use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
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
 * Takes a record from the holder its caller read.
 *
 * @implements ApiPayload<AssignmentResultData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint(
    'assignments/unassign',
    'POST',
    AssignmentResultData::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::CommandBus,
)]
final class UnassignRecordPayload extends Data implements ApiPayload
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
        public string $holderType,
        #[Ulid]
        public string $holderId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

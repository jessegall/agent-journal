<?php

declare(strict_types=1);

namespace App\Calls\Assignments;

use App\Attributes\Api\Endpoint;
use App\Calls\Assignments\Concerns\NamesAssignedRecord;
use App\Calls\Assignments\Concerns\NamesRecipient;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Data\Assignments\AssignmentResultData;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
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
 * Hands an unheld record to a holder.
 *
 * @implements JournalCall<AssignmentResultData>
 */
#[MapName(SnakeCaseMapper::class)]
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
        public string $recipientType,
        #[Ulid]
        public string $recipientId,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}

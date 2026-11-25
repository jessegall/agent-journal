<?php

declare(strict_types=1);

namespace App\Api\Assignments;

use App\Api\Assignments\Concerns\NamesAssignedRecord;
use App\Api\Assignments\Concerns\NamesRecipient;
use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Data\Assignments\AssignmentResultData;
use App\Enums\Processes\ApiEffect;
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
 * @implements ApiPayload<AssignmentResultData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('assignments/assign', 'POST', AssignmentResultData::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class AssignRecordPayload extends Data implements ApiPayload
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

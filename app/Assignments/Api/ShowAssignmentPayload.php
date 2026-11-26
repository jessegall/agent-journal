<?php

declare(strict_types=1);

namespace App\Assignments\Api;

use App\Assignments\Api\Concerns\NamesAssignedRecord;
use App\Assignments\Data\RecordHolderData;
use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads who holds one record.
 *
 * @implements ApiPayload<RecordHolderData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('assignments/show', 'POST', RecordHolderData::class, ApiEffect::Read)]
final class ShowAssignmentPayload extends Data implements ApiPayload
{
    use NamesAssignedRecord;

    public function __construct(
        #[Max(100)]
        public string $recordType,
        #[Ulid]
        public string $recordId,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Calls\Assignments;

use App\Attributes\Endpoint;
use App\Calls\Assignments\Concerns\NamesAssignedRecord;
use App\Contracts\Domains\JournalCall;
use App\Data\Assignments\RecordHolderData;
use App\Enums\Processes\CallEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads who holds one record.
 *
 * @implements JournalCall<RecordHolderData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('assignments/show', 'POST', RecordHolderData::class, CallEffect::Read)]
final class ShowAssignmentCall extends Data implements JournalCall
{
    use NamesAssignedRecord;

    public function __construct(
        #[Max(100)]
        public string $recordType,
        #[Ulid]
        public string $recordId,
    ) {}
}

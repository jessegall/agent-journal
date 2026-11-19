<?php

declare(strict_types=1);

namespace App\Assignments\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Assignments\Calls\Concerns\NamesAssignedRecord;
use App\Http\Data\Assignments\RecordHolderData;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * Reads who holds one record.
 *
 * @implements JournalCall<RecordHolderData>
 */
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

<?php

declare(strict_types=1);

namespace App\Assignments\Calls;

use App\Actors\Enums\ActorType;
use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Assignments\Calls\Concerns\NamesAutoAssignment;
use App\Http\Data\Assignments\AutoAssignmentStatusData;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * Reads an actor's auto-assignment of one kind of record.
 *
 * @implements JournalCall<AutoAssignmentStatusData>
 */
#[Endpoint('assignments/auto/show', 'POST', AutoAssignmentStatusData::class, CallEffect::Read)]
final class ShowAutoAssignmentCall extends Data implements JournalCall
{
    use NamesAutoAssignment;

    public function __construct(
        public ActorType $actorType,
        #[Ulid]
        public string $actorId,
        #[Max(100)]
        public string $assignableType,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Assignments\Calls;

use App\Actors\Enums\ActorType;
use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Http\Data\Assignments\AutoAssignmentPageData;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * Lists an actor's auto-assignments, one page after the id named.
 *
 * @implements JournalCall<AutoAssignmentPageData>
 */
#[Endpoint('assignments/auto/list', 'POST', AutoAssignmentPageData::class, CallEffect::Read)]
final class ListAutoAssignmentsCall extends Data implements JournalCall
{
    public function __construct(
        public ActorType $actorType,
        #[Ulid]
        public string $actorId,
        #[Ulid]
        public string|null $after = null,
    ) {}
}

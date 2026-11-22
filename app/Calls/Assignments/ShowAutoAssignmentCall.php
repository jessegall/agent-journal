<?php

declare(strict_types=1);

namespace App\Calls\Assignments;

use App\Attributes\Endpoint;
use App\Calls\Assignments\Concerns\NamesAutoAssignment;
use App\Contracts\Domains\JournalCall;
use App\Data\Assignments\AutoAssignmentStatusData;
use App\Enums\ActorType;
use App\Enums\CallEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads an actor's auto-assignment of one kind of record.
 *
 * @implements JournalCall<AutoAssignmentStatusData>
 */
#[MapName(SnakeCaseMapper::class)]
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

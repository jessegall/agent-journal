<?php

declare(strict_types=1);

namespace App\Calls\Assignments;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Data\Assignments\AutoAssignmentPageData;
use App\Enums\Processes\CallEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Lists an actor's auto-assignments, one page after the id named.
 *
 * @implements JournalCall<AutoAssignmentPageData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('assignments/auto/list', 'POST', AutoAssignmentPageData::class, CallEffect::Read)]
final class ListAutoAssignmentsCall extends Data implements JournalCall
{
    public function __construct(
        public string $actorType,
        #[Ulid]
        public string $actorId,
        #[Ulid]
        public string|null $after = null,
    ) {}
}

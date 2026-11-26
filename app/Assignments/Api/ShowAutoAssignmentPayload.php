<?php

declare(strict_types=1);

namespace App\Assignments\Api;

use App\Assignments\Api\Concerns\NamesAutoAssignment;
use App\Assignments\Data\AutoAssignmentStatusData;
use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads an actor's auto-assignment of one kind of record.
 *
 * @implements ApiPayload<AutoAssignmentStatusData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('assignments/auto/show', 'POST', AutoAssignmentStatusData::class, ApiEffect::Read)]
final class ShowAutoAssignmentPayload extends Data implements ApiPayload
{
    use NamesAutoAssignment;

    public function __construct(
        public string $actorType,
        #[Ulid]
        public string $actorId,
        #[Max(100)]
        public string $assignableType,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Assignments\Api;

use App\Assignments\Data\AutoAssignmentPageData;
use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Lists an actor's auto-assignments, one page after the id named.
 *
 * @implements ApiPayload<AutoAssignmentPageData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('assignments/auto/list', 'POST', AutoAssignmentPageData::class, ApiEffect::Read)]
final class ListAutoAssignmentsPayload extends Data implements ApiPayload
{
    public function __construct(
        public string $actorType,
        #[Ulid]
        public string $actorId,
        #[Ulid]
        public string|null $after = null,
    ) {}
}

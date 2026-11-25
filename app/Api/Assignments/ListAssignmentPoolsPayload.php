<?php

declare(strict_types=1);

namespace App\Api\Assignments;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Lists the pools an auto-assignment of one kind of record can take from.
 *
 * @implements ApiPayload<PoolList>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('assignments/auto/pools', 'POST', PoolList::class, ApiEffect::Read)]
final class ListAssignmentPoolsPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(100)]
        public string $assignableType,
    ) {}
}

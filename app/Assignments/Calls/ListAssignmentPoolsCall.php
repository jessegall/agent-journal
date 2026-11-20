<?php

declare(strict_types=1);

namespace App\Assignments\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Lists the pools an auto-assignment of one kind of record can take from.
 *
 * @implements JournalCall<PoolList>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('assignments/auto/pools', 'POST', PoolList::class, CallEffect::Read)]
final class ListAssignmentPoolsCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(100)]
        public string $assignableType,
    ) {}
}

<?php

declare(strict_types=1);

namespace Domain\Memory\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Lists one page of the caller's own memories.
 *
 * @implements JournalCall<MemoryPage>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('memory/list', 'POST', MemoryPage::class, CallEffect::Read)]
final class ListMemoriesCall extends Data implements JournalCall
{
    public function __construct(
        #[Min(1)]
        public int $page = 1,
    ) {}
}

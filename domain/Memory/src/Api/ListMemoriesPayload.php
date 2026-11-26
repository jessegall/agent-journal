<?php

declare(strict_types=1);

namespace Domain\Memory\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Lists one page of the caller's own memories.
 *
 * @implements ApiPayload<MemoryPage>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('memory/list', 'POST', MemoryPage::class, ApiEffect::Read)]
final class ListMemoriesPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Min(1)]
        public int $page = 1,
    ) {}
}

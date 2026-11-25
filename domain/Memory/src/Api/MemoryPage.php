<?php

declare(strict_types=1);

namespace Domain\Memory\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One page of the caller's own memories.
 */
#[MapName(SnakeCaseMapper::class)]
final class MemoryPage extends Data
{
    /**
     * @param  list<array{id: string, number: int, text: string, weight: int, revision: int}>  $memories
     */
    public function __construct(
        public array $memories,
        public int $page,
        public int $perPage,
        public int $total,
    ) {}
}

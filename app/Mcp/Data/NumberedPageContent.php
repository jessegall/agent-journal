<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One page of a numbered list as a tool answers it: the cards that fit, where the page stands and how many cards the
 * caller may no longer see.
 */
#[MapOutputName(SnakeCaseMapper::class)]
final class NumberedPageContent extends Data
{
    /**
     * @param  list<array<string, mixed>>  $cards
     */
    public function __construct(
        public readonly array $cards,
        public readonly int $page,
        public readonly int $perPage,
        public readonly int $total,
        public readonly int $unavailableCount,
    ) {}
}

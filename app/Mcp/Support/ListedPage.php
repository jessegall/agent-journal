<?php

declare(strict_types=1);

namespace App\Mcp\Support;

/**
 * One numbered page an owner's reader returned, as a list tool shows it: each card by its reference in page order,
 * the page number and size, and how many entries match in all.
 */
final readonly class ListedPage
{
    /**
     * @param  array<string, array<string, mixed>>  $cards
     */
    public function __construct(
        public array $cards,
        public int $page,
        public int $perPage,
        public int $total,
    ) {}

    public function hasNextPage(): bool
    {
        return $this->page * $this->perPage < $this->total;
    }
}

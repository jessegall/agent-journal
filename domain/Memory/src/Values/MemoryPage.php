<?php

declare(strict_types=1);

namespace Domain\Memory\Values;

/**
 * One page of the calling actor's memories, heaviest first, with how many there are in all.
 */
final readonly class MemoryPage
{
    /**
     * @param  list<MemoryCard>  $cards
     */
    public function __construct(
        public array $cards,
        public int $page,
        public int $perPage,
        public int $total,
    ) {}
}

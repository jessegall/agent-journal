<?php

declare(strict_types=1);

namespace App\Sharing\Support;

/**
 * The most work one preview or public read may do: queries, time, bytes loaded and rendered, records, links and
 * relation hops. Every provider call of that preview or read is charged to the same budget.
 */
final readonly class ShareBudget
{
    public function __construct(
        public int $mostQueries,
        public int $mostMilliseconds,
        public int $mostLoadedBytes,
        public int $mostRenderedBytes,
        public int $mostRecords,
        public int $mostLinks,
        public int $mostHops,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Exceptions\ContinuationStale;

/**
 * Where a bounded read goes on: the tool and its stable selector, the first page's filters and view, the exact offset
 * (an entry, or a line with a character offset inside it), the record revision it reads and the retained page it
 * walks, when those apply. It is what a signed cursor carries; it grants nothing.
 */
final readonly class Continuation
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function __construct(
        public string $tool,
        public string $selector,
        public array $filters,
        public int $offset,
        public int $characterOffset = 0,
        public int|null $revision = null,
        public string|null $retainedPageId = null,
    ) {}

    /**
     * @throws ContinuationStale
     */
    public function assertCurrentRevision(int $current): void
    {
        if ($this->revision !== null && $this->revision !== $current) {
            throw ContinuationStale::revisionChanged($this->revision, $current);
        }
    }
}

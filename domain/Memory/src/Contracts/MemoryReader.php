<?php

declare(strict_types=1);

namespace Domain\Memory\Contracts;

use Domain\Memory\Api\MemoryPage;

/**
 * Reads the calling actor's own memories, 50 to a page; nobody reads another actor's.
 */
interface MemoryReader
{
    public const int PER_PAGE = 50;

    public function own(int $page): MemoryPage;
}

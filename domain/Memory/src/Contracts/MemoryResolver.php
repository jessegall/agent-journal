<?php

declare(strict_types=1);

namespace Domain\Memory\Contracts;

use Domain\Memory\Api\MemoryCard;
use Domain\Memory\Api\MemoryPage;
use Domain\Memory\Exceptions\MemoryUnavailable;

/**
 * Reads the calling actor's own memories, 50 to a page; nobody reads another actor's.
 */
interface MemoryResolver
{
    public const int PER_PAGE = 50;

    public function own(int $page): MemoryPage;

    /**
     * The caller's own memory with its revision; a missing or another actor's memory is unavailable.
     *
     * @throws MemoryUnavailable
     */
    public function memory(string $memoryId): MemoryCard;
}

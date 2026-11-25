<?php

declare(strict_types=1);

namespace Domain\Memory\Events;

/**
 * A memory's text or weight was revised.
 */
final readonly class MemoryRevised implements MemoryEvent
{
    public function __construct(
        public string $memoryId,
    ) {}
}

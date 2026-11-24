<?php

declare(strict_types=1);

namespace Domain\Memory\Events;

/**
 * A memory's text or weight was revised.
 */
final readonly class MemoryRevised extends MemoryEvent
{
    public function __construct(
        public string $memoryId,
    ) {}
}

<?php

declare(strict_types=1);

namespace Domain\Memory\Events;

/**
 * A memory was saved for an actor.
 */
final readonly class MemorySaved implements MemoryEvent
{
    public function __construct(
        public string $memoryId,
    ) {}
}

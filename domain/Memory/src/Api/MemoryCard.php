<?php

declare(strict_types=1);

namespace Domain\Memory\Api;

/**
 * One memory as its owner's list shows it.
 */
final readonly class MemoryCard
{
    public function __construct(
        public string $id,
        public int $number,
        public string $text,
        public int $weight,
    ) {}
}

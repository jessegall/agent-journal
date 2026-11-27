<?php

declare(strict_types=1);

namespace Domain\Memory\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The memory a write made or changed.
 */
#[MapName(SnakeCaseMapper::class)]
final class MemoryNamed extends Data
{
    public function __construct(
        public readonly string $memoryId,
    ) {}
}

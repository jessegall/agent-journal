<?php

declare(strict_types=1);

namespace App\Connections\Data;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One entry of a project folder as its host listed it, and as a read keeps it: its name, whether it is a folder, and
 * its size in bytes. A host sends the fields in snake case, and the read keeps them so.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProjectEntryData extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly bool $isFolder,
        public readonly int $size,
    ) {}
}

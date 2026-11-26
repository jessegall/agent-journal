<?php

declare(strict_types=1);

namespace App\Connections\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One folder or file of a connected project's tree: its path from the project's root, its name and size, and for a
 * folder the user opened, whether its read still waits for the host or failed, and the entries in it once read.
 */
#[TypeScript]
final class ProjectTreeEntryData extends Data
{
    /**
     * @param  list<ProjectTreeEntryData>  $children
     */
    public function __construct(
        public readonly string $path,
        public readonly string $name,
        public readonly bool $isFolder,
        public readonly int $size,
        public readonly bool $isOpen = false,
        public readonly bool $isLoading = false,
        public readonly bool $isFailed = false,
        #[DataCollectionOf(ProjectTreeEntryData::class)]
        public readonly array $children = [],
    ) {}
}

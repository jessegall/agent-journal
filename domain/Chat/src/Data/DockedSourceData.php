<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Domain\Chat\Enums\DockedState;
use Spatie\LaravelData\Data;

/**
 * One placement as a list shows it: which source, its title when the caller may read it, and whether it shows.
 */
final class DockedSourceData extends Data
{
    public function __construct(
        public readonly string $placementId,
        public readonly string $type,
        public readonly string $sourceId,
        public readonly string $title,
        public readonly DockedState $state,
    ) {}
}

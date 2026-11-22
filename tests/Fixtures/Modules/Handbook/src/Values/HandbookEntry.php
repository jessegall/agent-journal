<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Handbook\Values;

/**
 * The header of a handbook entry, as the scoped header read gives it: never its text or its references.
 */
final readonly class HandbookEntry
{
    public function __construct(
        public int $ownerId,
        public int $number,
        public string $title,
        public string $edition,
        public string $summary,
        public bool $sharesReferences = true,
        public bool $hasTabs = true,
    ) {}
}

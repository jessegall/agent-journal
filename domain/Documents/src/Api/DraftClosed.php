<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use Spatie\LaravelData\Data;

/**
 * A closed draft: the document's revision now, and whether closing published a new one.
 */
final class DraftClosed extends Data
{
    public function __construct(
        public readonly int $revisionNumber,
        public readonly bool $isPublished,
    ) {}
}

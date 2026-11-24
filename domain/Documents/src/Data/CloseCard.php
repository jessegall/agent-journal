<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How one draft of a document ended: why, who closed it, from which revision to which, and whether it published.
 */
#[TypeScript]
final class CloseCard extends Data
{
    public function __construct(
        public readonly string $cause,
        public readonly string|null $closerId,
        public readonly string|null $reason,
        public readonly string $baseRevision,
        public readonly string $resultRevision,
        public readonly bool $isPublished,
        public readonly string $closedAt,
    ) {}
}

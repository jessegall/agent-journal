<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Models\DocumentClose;
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
        public readonly bool $published,
        public readonly string $closedAt,
    ) {}

    /**
     * A document's close as a card: why, by whom and what it published.
     */
    public static function fromDocumentClose(DocumentClose $close): self
    {
        return self::from([
            'cause' => $close->cause->value,
            'closerId' => $close->closer_id,
            'reason' => $close->reason,
            'baseRevision' => (string) $close->base_revision_number,
            'resultRevision' => (string) $close->result_revision_number,
            'published' => $close->published,
            'closedAt' => (string) $close->closed_at?->toIso8601String(),
        ]);
    }
}

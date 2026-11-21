<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Models\DocumentRevision;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One revision of a document as its history lists it.
 */
#[TypeScript]
final class RevisionCard extends Data
{
    public function __construct(
        public readonly string $number,
        public readonly string $title,
        public readonly string $authorType,
        public readonly string $authorId,
        public readonly string $closedAt,
    ) {}

    /**
     * A document's revision as a card.
     */
    public static function fromDocumentRevision(DocumentRevision $revision): self
    {
        return self::from([
            'number' => (string) $revision->number,
            'title' => $revision->title,
            'authorType' => $revision->author_type->value,
            'authorId' => $revision->author_id,
            'closedAt' => (string) $revision->closed_at?->toIso8601String(),
        ]);
    }
}

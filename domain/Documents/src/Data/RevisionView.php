<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\Document;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One past or current revision of a document with its whole text, marked historical when a later one exists.
 */
#[TypeScript]
final class RevisionView extends Data
{
    public function __construct(
        public readonly string $documentNumber,
        public readonly string $number,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $body,
        public readonly string $authorType,
        public readonly string $authorId,
        public readonly string $closedAt,
        public readonly bool $historical,
    ) {}

    /**
     * A revision with its text, marked historical when its document has a later one.
     */
    public static function fromDocumentRevision(DocumentRevision $revision, Document $document): self
    {
        return self::from([
            'documentNumber' => (string) $document->number,
            'number' => (string) $revision->number,
            'title' => $revision->title,
            'abstract' => $revision->abstract,
            'body' => $revision->body,
            'authorType' => $revision->author_type->value,
            'authorId' => $revision->author_id,
            'closedAt' => (string) $revision->closed_at?->toIso8601String(),
            'historical' => $document->currentRevisionOrFail()->number !== $revision->number,
        ]);
    }
}

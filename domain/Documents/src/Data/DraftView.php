<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The editor's own open draft of a document, with its version and the revision it started from.
 */
#[TypeScript]
final class DraftView extends Data
{
    public function __construct(
        public readonly string $documentNumber,
        public readonly string $token,
        public readonly int $version,
        public readonly string $baseRevisionNumber,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $body,
        public readonly string $savedAt,
    ) {}

    /**
     * A document's draft as its writer sees it.
     */
    public static function fromDocumentDraft(DocumentDraft $draft, Document $document): self
    {
        return self::from([
            'documentNumber' => (string) $document->number,
            'token' => $draft->token,
            'version' => $draft->version,
            'baseRevisionNumber' => (string) $draft->base_revision_number,
            'title' => $draft->title,
            'abstract' => $draft->abstract,
            'body' => $draft->body,
            'savedAt' => (string) $draft->updated_at?->toIso8601String(),
        ]);
    }
}

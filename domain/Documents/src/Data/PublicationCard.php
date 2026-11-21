<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One document or report as a list shows it.
 */
#[TypeScript]
final class PublicationCard extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $number,
        public readonly string $title,
        public readonly string $abstract,
        public readonly AttentionState $attention,
        public readonly string|Optional $snippet = new Optional(),
        public readonly string|Optional $foundIn = new Optional(),
    ) {}

    /**
     * A document as a card: its current revision's title and abstract, and its attention.
     */
    public static function fromDocument(Document $document): self
    {
        $revision = $document->currentRevisionOrFail();

        return self::from([
            'id' => $document->id,
            'number' => (string) $document->number,
            'title' => $revision->title,
            'abstract' => $revision->abstract,
            'attention' => $document->attention,
        ]);
    }

    /**
     * A report as a card: its title, abstract and attention.
     */
    public static function fromReport(Report $report): self
    {
        return self::from([
            'id' => $report->id,
            'number' => (string) $report->number,
            'title' => $report->title,
            'abstract' => $report->abstract,
            'attention' => $report->attention,
        ]);
    }
}

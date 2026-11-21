<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A document or report as a card in a session's dock: its type word and number, title, abstract and page.
 */
#[TypeScript]
final class DockSuggestion extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly string $number,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $route,
    ) {}

    /**
     * A document as a dock suggestion: its current revision's title and abstract, at its own page.
     */
    public static function fromDocument(Document $document): self
    {
        $revision = $document->currentRevisionOrFail();

        return new self(
            'doc',
            (string) $document->number,
            $revision->title,
            $revision->abstract,
            "/documents/docs/{$document->number}",
        );
    }

    /**
     * A report as a dock suggestion: its title and abstract, at its own page.
     */
    public static function fromReport(Report $report): self
    {
        return new self(
            'report',
            (string) $report->number,
            $report->title,
            $report->abstract,
            "/documents/reports/{$report->number}",
        );
    }
}

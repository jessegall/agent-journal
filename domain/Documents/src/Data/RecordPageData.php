<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Support\MarkdownText;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One document or report on its own page: its label, title, abstract, and its body as safe HTML.
 */
#[TypeScript]
final class RecordPageData extends Data
{
    public function __construct(
        public readonly string $label,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $bodyHtml,
        public readonly string|Optional $revision = new Optional,
    ) {}

    public static function fromDocumentView(DocumentView $document): self
    {
        return self::from([
            'label' => "doc {$document->number}",
            'title' => $document->title,
            'abstract' => $document->abstract,
            'bodyHtml' => MarkdownText::body($document->body)->toSafeHtml(),
            'revision' => $document->revision,
        ]);
    }

    public static function fromReportView(ReportView $report): self
    {
        return self::from([
            'label' => "report {$report->number}",
            'title' => $report->title,
            'abstract' => $report->abstract,
            'bodyHtml' => MarkdownText::body($report->body)->toSafeHtml(),
        ]);
    }
}

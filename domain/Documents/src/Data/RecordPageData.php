<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Support\MarkdownText;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One document or report on its own page: its label, title, abstract, and its body as safe HTML.
 */
#[TypeScript]
final class RecordPageData extends Data
{
    /**
     * @param  list<CommentCard>  $comments
     */
    public function __construct(
        public readonly string $label,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $body,
        public readonly string $bodyHtml,
        #[DataCollectionOf(CommentCard::class)]
        public readonly array $comments,
        public readonly string|Optional $revision = new Optional,
    ) {}

    /**
     * @param  list<CommentCard>  $comments
     */
    public static function fromDocumentView(DocumentView $document, array $comments): self
    {
        return self::from([
            'label' => "doc {$document->number}",
            'title' => $document->title,
            'abstract' => $document->abstract,
            'body' => $document->body,
            'bodyHtml' => MarkdownText::body($document->body)->toSafeHtml(),
            'comments' => $comments,
            'revision' => $document->revision,
        ]);
    }

    /**
     * @param  list<CommentCard>  $comments
     */
    public static function fromReportView(ReportView $report, array $comments): self
    {
        return self::from([
            'label' => "report {$report->number}",
            'title' => $report->title,
            'abstract' => $report->abstract,
            'body' => $report->body,
            'bodyHtml' => MarkdownText::body($report->body)->toSafeHtml(),
            'comments' => $comments,
        ]);
    }
}

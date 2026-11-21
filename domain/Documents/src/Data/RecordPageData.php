<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use App\Comments\Data\CommentList;
use App\Docking\Cards\DockIdentity;
use App\Docking\Sources\Contracts\DockableWindow;
use App\Records\Data\RecordCard;
use App\Text\Support\MarkdownText;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One document or report on its own page: its label, title, abstract, and its body as safe HTML.
 */
#[TypeScript]
final class RecordPageData extends Data implements DockableWindow
{
    /**
     * @param  list<SettlementCard>  $settlements
     * @param  list<RecordCard>  $links
     */
    public function __construct(
        public readonly string $label,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $body,
        public readonly string $bodyHtml,
        public readonly CommentList $comments,
        public readonly AttentionState $attention,
        #[DataCollectionOf(SettlementCard::class)]
        public readonly array $settlements,
        #[DataCollectionOf(RecordCard::class)]
        public readonly array $links,
        public readonly bool $publiclyShared,
        public readonly string $sourceType,
        public readonly string $sourceId,
        public readonly RecordReadsData $reads,
        public readonly string|Optional $revision = new Optional(),
    ) {}

    /**
     * @param  list<SettlementCard>  $settlements
     * @param  list<RecordCard>  $links
     */
    public static function fromDocumentView(
        DocumentView $document,
        CommentList $comments,
        array $settlements,
        array $links,
        bool $publiclyShared,
        RecordReadsData $reads,
    ): self {
        return self::from([
            'label' => "doc {$document->number}",
            'title' => $document->title,
            'abstract' => $document->abstract,
            'body' => $document->body,
            'bodyHtml' => MarkdownText::body($document->body)->toSafeHtml(),
            'comments' => $comments,
            'attention' => $document->attention,
            'settlements' => $settlements,
            'links' => $links,
            'publiclyShared' => $publiclyShared,
            'sourceType' => Document::LINK_TYPE,
            'sourceId' => $document->id,
            'reads' => $reads,
            'revision' => $document->revision,
        ]);
    }

    /**
     * @param  list<SettlementCard>  $settlements
     * @param  list<RecordCard>  $links
     */
    public static function fromReportView(
        ReportView $report,
        CommentList $comments,
        array $settlements,
        array $links,
        bool $publiclyShared,
        RecordReadsData $reads,
    ): self {
        return self::from([
            'label' => "report {$report->number}",
            'title' => $report->title,
            'abstract' => $report->abstract,
            'body' => $report->body,
            'bodyHtml' => MarkdownText::body($report->body)->toSafeHtml(),
            'comments' => $comments,
            'attention' => $report->attention,
            'settlements' => $settlements,
            'links' => $links,
            'publiclyShared' => $publiclyShared,
            'sourceType' => Report::LINK_TYPE,
            'sourceId' => $report->id,
            'reads' => $reads,
        ]);
    }

    public function dockSource(): DockIdentity
    {
        return new DockIdentity($this->sourceType, $this->sourceId);
    }
}

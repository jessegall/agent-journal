<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use Domain\Documents\Data\CloseCard;
use Domain\Documents\Data\DockSuggestion;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Data\RevisionCard;
use Domain\Documents\Data\RevisionView;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\RecordSettlement;
use Domain\Documents\Models\Report;

/**
 * How each document record becomes the view, card or suggestion a page or dock shows; the one place that knows each
 * mapping, kept out of the exported Data classes.
 */
final readonly class RecordViews
{
    /**
     * A document as its page shows it: its current revision's text, who made it and its attention.
     */
    public static function documentView(Document $document): DocumentView
    {
        $revision = $document->currentRevisionOrFail();

        return new DocumentView(
            $document->id,
            (string) $document->number,
            $revision->title,
            $revision->abstract,
            $revision->body,
            (string) $revision->number,
            $document->creator_type->value,
            $document->creator_id,
            $document->attention,
            (string) $document->created_at?->toIso8601String(),
        );
    }

    /**
     * A revision with its text, marked historical when its document has a later one.
     */
    public static function revisionView(DocumentRevision $revision, Document $document): RevisionView
    {
        return RevisionView::from([
            'documentNumber' => (string) $document->number,
            'number' => (string) $revision->number,
            'title' => $revision->title,
            'abstract' => $revision->abstract,
            'body' => $revision->body,
            'authorType' => $revision->author_type->value,
            'authorId' => $revision->author_id,
            'closedAt' => (string) $revision->closed_at?->toIso8601String(),
            'isHistorical' => $document->currentRevisionOrFail()->number !== $revision->number,
        ]);
    }

    /**
     * A record's settlement as a card: who settled it, why and when.
     */
    public static function settlementCard(RecordSettlement $settlement): SettlementCard
    {
        return SettlementCard::from([
            'actorType' => $settlement->actor_type->value,
            'actorId' => $settlement->actor_id,
            'reason' => $settlement->reason,
            'revision' => $settlement->revision_number === null ? null : (string) $settlement->revision_number,
            'settledAt' => $settlement->settled_at->toIso8601String(),
        ]);
    }

    /**
     * A document's close as a card: why, by whom and what it published.
     */
    public static function closeCard(DocumentClose $close): CloseCard
    {
        return CloseCard::from([
            'cause' => $close->cause->value,
            'closerId' => $close->closer_id,
            'reason' => $close->reason,
            'baseRevision' => (string) $close->base_revision_number,
            'resultRevision' => (string) $close->result_revision_number,
            'isPublished' => $close->published,
            'closedAt' => (string) $close->closed_at?->toIso8601String(),
        ]);
    }

    /**
     * A document as a card: its current revision's title and abstract, and its attention.
     */
    public static function documentCard(Document $document): PublicationCard
    {
        $revision = $document->currentRevisionOrFail();

        return PublicationCard::from([
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
    public static function reportCard(Report $report): PublicationCard
    {
        return PublicationCard::from([
            'id' => $report->id,
            'number' => (string) $report->number,
            'title' => $report->title,
            'abstract' => $report->abstract,
            'attention' => $report->attention,
        ]);
    }

    /**
     * A document's draft as its writer sees it.
     */
    public static function draftView(DocumentDraft $draft, Document $document): DraftView
    {
        return DraftView::from([
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

    /**
     * A document's revision as a card.
     */
    public static function revisionCard(DocumentRevision $revision): RevisionCard
    {
        return RevisionCard::from([
            'number' => (string) $revision->number,
            'title' => $revision->title,
            'authorType' => $revision->author_type->value,
            'authorId' => $revision->author_id,
            'closedAt' => (string) $revision->closed_at?->toIso8601String(),
        ]);
    }

    /**
     * A document as a dock suggestion: its current revision's title and abstract, at its own page.
     */
    public static function documentSuggestion(Document $document): DockSuggestion
    {
        $revision = $document->currentRevisionOrFail();

        return new DockSuggestion(
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
    public static function reportSuggestion(Report $report): DockSuggestion
    {
        return new DockSuggestion(
            'report',
            (string) $report->number,
            $report->title,
            $report->abstract,
            "/documents/reports/{$report->number}",
        );
    }

    /**
     * A report as its page shows it: its text, who filed it and its attention.
     */
    public static function reportView(Report $report): ReportView
    {
        return new ReportView(
            $report->id,
            (string) $report->number,
            $report->title,
            $report->abstract,
            $report->body,
            $report->creator_type->value,
            $report->creator_id,
            $report->attention,
            $report->filed_at->toIso8601String(),
        );
    }
}

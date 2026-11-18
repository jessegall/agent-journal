<?php

declare(strict_types=1);

namespace Domain\Documents;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Api\Events\DocumentClosed;
use Domain\Documents\Api\Events\DocumentCreated;
use Domain\Documents\Api\Events\DocumentDraftSaved;
use Domain\Documents\Api\Events\DocumentOpened;
use Domain\Documents\Api\Events\DocumentPublished;
use Domain\Documents\Api\Events\ReportFiled;
use Domain\Documents\Commands\ChangeDocumentDetails;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Commands\ReplaceDocumentBody;
use Domain\Documents\Commands\ReplaceDocumentSection;
use Domain\Documents\Commands\ReplaceDocumentText;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\DocumentCard;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\DocumentList;
use Domain\Documents\Data\DocumentPageData;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\DraftState;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Data\RecordPageData;
use Domain\Documents\Data\ReportCard;
use Domain\Documents\Data\ReportList;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Data\RevisionCard;
use Domain\Documents\Data\RevisionView;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Enums\EditingState;
use Domain\Documents\Exceptions\ContentMissing;
use Domain\Documents\Exceptions\ContentTooLarge;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Exceptions\MarkdownInvalid;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Exceptions\SectionMissing;
use Domain\Documents\Exceptions\TextMatchInvalid;
use Domain\Documents\Http\Controllers\CloseDraftPageController;
use Domain\Documents\Http\Controllers\CreateDocumentPageController;
use Domain\Documents\Http\Controllers\CreateReportPageController;
use Domain\Documents\Http\Controllers\OpenDocumentPageController;
use Domain\Documents\Http\Controllers\SaveDraftPageController;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\Report;
use Domain\Documents\Readers\DocumentWindowReader;
use Domain\Documents\Readers\LibraryWindowReader;
use Domain\Documents\Readers\ReportWindowReader;

final class DocumentsDomain extends Domain implements ProvidesCommands, ProvidesNavigation, ProvidesNumberedModels, ProvidesPages
{
    use HasNumberedModels;

    public function description(): string
    {
        return 'Documents that keep every revision of their text, and reports filed once.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->events(DocumentCreated::class, ReportFiled::class, DocumentOpened::class, DocumentDraftSaved::class, DocumentClosed::class, DocumentPublished::class)
            ->contracts(DraftReader::class, DocumentReader::class, ReportReader::class)
            ->values(EditingState::class, DraftState::class, DocumentPageData::class, RecordPageData::class, DraftView::class, RevisionCard::class, RevisionView::class, DraftReference::class, DraftTarget::class, CloseResult::class, CloseCause::class, CreatedRecord::class, AttentionState::class, AttentionFilter::class, DocumentFilters::class, DocumentCard::class, DocumentView::class, DocumentList::class, ReportCard::class, ReportView::class, ReportList::class)
            ->commands(CreateDocument::class, CreateReport::class, OpenDocument::class, ReplaceDocumentBody::class, ReplaceDocumentSection::class, ReplaceDocumentText::class, ChangeDocumentDetails::class, CloseDocument::class)
            ->exceptions(DraftMissing::class, SectionMissing::class, TextMatchInvalid::class, DraftHeld::class, DraftConflict::class, ContentMissing::class, ContentTooLarge::class, MarkdownInvalid::class, DocumentMissing::class, ReportMissing::class)
            ->build();
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Document::class), NumberedModel::within(DocumentRevision::class, Document::class), NumberedModel::global(Report::class)];
    }

    public function commands(): array
    {
        return [CreateDocument::class, CreateReport::class, OpenDocument::class, ReplaceDocumentBody::class, ReplaceDocumentSection::class, ReplaceDocumentText::class, ChangeDocumentDetails::class, CloseDocument::class];
    }

    public function pages(): array
    {
        return [
            Page::make('library', 'Documents', Icon::Docs, LibraryWindowReader::class, 'LibraryWindow.vue')
                ->at('')
                ->actions(
                    ActionRoute::post('docs', CreateDocumentPageController::class, 'create-document'),
                    ActionRoute::post('reports', CreateReportPageController::class, 'create-report'),
                ),
            Page::make('document', 'Document', Icon::Docs, DocumentWindowReader::class, 'DocumentWindow.vue')
                ->at('docs/{document}')
                ->inInspector()
                ->actions(
                    ActionRoute::post('docs/{document}/open', OpenDocumentPageController::class, 'open-document'),
                    ActionRoute::post('docs/{document}/save', SaveDraftPageController::class, 'save-draft'),
                    ActionRoute::post('docs/{document}/close', CloseDraftPageController::class, 'close-draft'),
                )
                ->slots(Slot::record('inspector', 'document')),
            Page::make('report', 'Report', Icon::Docs, ReportWindowReader::class, 'RecordWindow.vue')
                ->at('reports/{report}'),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('library', 'Documents', Icon::Docs, position: 30),
        ];
    }
}

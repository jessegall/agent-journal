<?php

declare(strict_types=1);

namespace Domain\Documents;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasLinkRecords;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Contracts\ProvidesLinkRecords;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Contracts\ProvidesSections;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Api\Events\DocumentClosed;
use Domain\Documents\Api\Events\DocumentCreated;
use Domain\Documents\Api\Events\DocumentDraftSaved;
use Domain\Documents\Api\Events\DocumentOpened;
use Domain\Documents\Api\Events\DocumentPublished;
use Domain\Documents\Api\Events\RecordDockChanged;
use Domain\Documents\Api\Events\RecordSettled;
use Domain\Documents\Api\Events\ReportFiled;
use Domain\Documents\Commands\ChangeDocumentDetails;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Commands\DockDocument;
use Domain\Documents\Commands\DockReport;
use Domain\Documents\Commands\HideDocumentDock;
use Domain\Documents\Commands\HideReportDock;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Commands\RecoverDocument;
use Domain\Documents\Commands\ReplaceDocumentBody;
use Domain\Documents\Commands\ReplaceDocumentSection;
use Domain\Documents\Commands\ReplaceDocumentText;
use Domain\Documents\Commands\SettleDocument;
use Domain\Documents\Commands\SettleReport;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\CloseCard;
use Domain\Documents\Data\DockCard;
use Domain\Documents\Data\DockData;
use Domain\Documents\Data\DockSession;
use Domain\Documents\Data\DocumentCard;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\DocumentList;
use Domain\Documents\Data\DocumentPageData;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\DraftState;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordPageData;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\ReportCard;
use Domain\Documents\Data\ReportList;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Data\RevisionCard;
use Domain\Documents\Data\RevisionPageData;
use Domain\Documents\Data\RevisionView;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Enums\EditingState;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Exceptions\SettlementDenied;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Http\Controllers\CloseDraftPageController;
use Domain\Documents\Http\Controllers\CreateDocumentPageController;
use Domain\Documents\Http\Controllers\CreateReportPageController;
use Domain\Documents\Http\Controllers\DockRecordController;
use Domain\Documents\Http\Controllers\HideDockController;
use Domain\Documents\Http\Controllers\OpenDocumentPageController;
use Domain\Documents\Http\Controllers\RecoverDocumentPageController;
use Domain\Documents\Http\Controllers\SaveDraftPageController;
use Domain\Documents\Http\Controllers\SettleDocumentPageController;
use Domain\Documents\Http\Controllers\SettleReportPageController;
use Domain\Documents\Links\DocumentLinkRecords;
use Domain\Documents\Links\ReportLinkRecords;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\Report;
use Domain\Documents\Readers\DocumentDockReader;
use Domain\Documents\Readers\DocumentWindowReader;
use Domain\Documents\Readers\LibraryWindowReader;
use Domain\Documents\Readers\ReportWindowReader;
use Domain\Documents\Readers\RevisionWindowReader;

final class DocumentsDomain extends Domain implements ProvidesCommands, ProvidesLinkRecords, ProvidesNavigation, ProvidesNumberedModels, ProvidesPages, ProvidesSections
{
    use HasLinkRecords, HasNumberedModels;

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
            ->events(DocumentCreated::class, ReportFiled::class, DocumentOpened::class, DocumentDraftSaved::class, DocumentClosed::class, DocumentPublished::class, RecordSettled::class, RecordDockChanged::class)
            ->contracts(DraftReader::class, DocumentReader::class, ReportReader::class)
            ->values(DockSession::class, DockCard::class, DockData::class, CloseCard::class, RecordInspection::class, SettlementCard::class, RevisionPageData::class, RecordText::class, EditingState::class, DraftState::class, DocumentPageData::class, RecordPageData::class, DraftView::class, RevisionCard::class, RevisionView::class, DraftReference::class, DraftTarget::class, CloseResult::class, CloseCause::class, CreatedRecord::class, AttentionState::class, AttentionFilter::class, DocumentFilters::class, DocumentCard::class, DocumentView::class, DocumentList::class, ReportCard::class, ReportView::class, ReportList::class)
            ->commands(CreateDocument::class, CreateReport::class, OpenDocument::class, ReplaceDocumentBody::class, ReplaceDocumentSection::class, ReplaceDocumentText::class, ChangeDocumentDetails::class, CloseDocument::class, SettleDocument::class, SettleReport::class, RecoverDocument::class, DockDocument::class, DockReport::class, HideDocumentDock::class, HideReportDock::class)
            ->exceptions(SettlementDenied::class, StaleRead::class, DraftMissing::class, DraftHeld::class, DraftConflict::class, DocumentMissing::class, ReportMissing::class)
            ->build();
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Document::class), NumberedModel::within(DocumentRevision::class, Document::class), NumberedModel::global(Report::class)];
    }

    public function linkRecords(): array
    {
        return [Document::LINK_TYPE => DocumentLinkRecords::class, Report::LINK_TYPE => ReportLinkRecords::class];
    }

    public function commands(): array
    {
        return [CreateDocument::class, CreateReport::class, OpenDocument::class, ReplaceDocumentBody::class, ReplaceDocumentSection::class, ReplaceDocumentText::class, ChangeDocumentDetails::class, CloseDocument::class, SettleDocument::class, SettleReport::class, RecoverDocument::class, DockDocument::class, DockReport::class, HideDocumentDock::class, HideReportDock::class];
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
                    ActionRoute::post('docs/{document}/settle', SettleDocumentPageController::class, 'settle-document'),
                    ActionRoute::post('docs/{document}/recover', RecoverDocumentPageController::class, 'recover-draft'),
                )
                ->slots(Slot::record('inspector', 'document')),
            Page::make('revision', 'Revision', Icon::Docs, RevisionWindowReader::class, 'RevisionWindow.vue')
                ->at('docs/{document}/revisions/{revision}'),
            Page::make('report', 'Report', Icon::Docs, ReportWindowReader::class, 'ReportWindow.vue')
                ->at('reports/{report}')
                ->actions(
                    ActionRoute::post('reports/{report}/settle', SettleReportPageController::class, 'settle-report'),
                ),
        ];
    }

    public function sections(): array
    {
        return [
            Section::make('records', 'Documents and reports', 'chat.dock', SlotContextType::Session, DocumentDockReader::class, 'DocumentDock.vue')
                ->actions(
                    ActionRoute::post('dock', DockRecordController::class, 'dock-record'),
                    ActionRoute::post('dock/hide', HideDockController::class, 'hide-dock'),
                ),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('library', 'Documents', Icon::Docs, position: 30),
        ];
    }
}

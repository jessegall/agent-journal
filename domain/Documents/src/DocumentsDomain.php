<?php

declare(strict_types=1);

namespace Domain\Documents;

use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyDefinition;
use App\Autoload\Support\FolderClasses;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandProvider;
use App\Domains\Concerns\HasLinkRecords;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Contracts\LinkRecordProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Mcp\Contracts\McpToolProvider;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalTool;
use App\Numbers\Contracts\NumberedModelProvider;
use App\Numbers\Support\NumberedModel;
use App\Operations\Enums\AccessType;
use App\Sharing\Contracts\ShareRecordContributor;
use App\Sharing\Support\ShareRecordDefinition;
use App\Ui\Contracts\MenuProvider;
use App\Ui\Contracts\NativePartProvider;
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Contracts\SectionProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\Menu;
use App\Ui\Declarations\MenuItem;
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
use Domain\Documents\Api\Events\DraftKept;
use Domain\Documents\Api\Events\RecordSettled;
use Domain\Documents\Api\Events\ReportFiled;
use Domain\Documents\Api\RetainedDraftView;
use Domain\Documents\Commands\ChangeDocumentDetails;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Commands\CloseReport;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Commands\EditDocument;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Commands\RecoverDocument;
use Domain\Documents\Commands\ReplaceDocumentBody;
use Domain\Documents\Commands\ReplaceDocumentText;
use Domain\Documents\Commands\SettleDocument;
use Domain\Documents\Contracts\AttachmentReader;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Contracts\DraftResolver;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\CloseCard;
use Domain\Documents\Data\DockData;
use Domain\Documents\Data\DockSuggestion;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\DraftState;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordReadsData;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Data\RevisionCard;
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
use Domain\Documents\Http\Controllers\OpenDocumentPageController;
use Domain\Documents\Http\Controllers\RecoverDocumentPageController;
use Domain\Documents\Http\Controllers\SaveDraftPageController;
use Domain\Documents\Http\Controllers\SettleDocumentPageController;
use Domain\Documents\Http\Controllers\SettleReportPageController;
use Domain\Documents\Links\DocumentLinkRecords;
use Domain\Documents\Links\ReportLinkRecords;
use Domain\Documents\Mcp\DocumentSearch;
use Domain\Documents\Mcp\OpenReportsOverview;
use Domain\Documents\Mcp\ReportSearch;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\Report;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Policies\ReportPolicy;
use Domain\Documents\Policies\UploadPolicy;
use Domain\Documents\Resolvers\DocumentDockResolver;
use Domain\Documents\Resolvers\DocumentWindowResolver;
use Domain\Documents\Resolvers\LibraryWindowResolver;
use Domain\Documents\Resolvers\ReportWindowResolver;
use Domain\Documents\Resolvers\RevisionWindowResolver;
use Domain\Documents\Support\DocumentShareProvider;
use Domain\Documents\Support\ReportShareProvider;

final class DocumentsDomain extends Domain implements
    CommandProvider,
    LinkRecordProvider,
    McpToolProvider,
    MenuProvider,
    NativePartProvider,
    NavigationProvider,
    NumberedModelProvider,
    PageProvider,
    PolicyProvider,
    SectionProvider,
    ShareRecordContributor
{
    use HasLinkRecords;
    use HasNumberedModels;

    /**
     * The full key of a document's actions menu.
     */
    public const string DOCUMENT_ACTIONS = 'documents.document-actions';

    private const string SHARE_LINKED_RECORD = 'share-linked-record';

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
            ->events(
                DocumentCreated::class,
                ReportFiled::class,
                DocumentOpened::class,
                DocumentDraftSaved::class,
                DocumentClosed::class,
                DocumentPublished::class,
                DraftKept::class,
                RecordSettled::class,
            )
            ->contracts(DraftResolver::class, DraftReader::class, DocumentResolver::class, ReportResolver::class)
            ->contracts(AttachmentReader::class, DocumentReader::class, ReportReader::class)
            ->values(
                DockSuggestion::class,
                DockData::class,
                CloseCard::class,
                RecordInspection::class,
                SettlementCard::class,
                RecordText::class,
                EditingState::class,
                DraftState::class,
                RecordReadsData::class,
                DraftView::class,
                RevisionCard::class,
                RevisionView::class,
                DraftReference::class,
                RetainedDraftView::class,
                DraftTarget::class,
                CloseResult::class,
                CloseCause::class,
                CreatedRecord::class,
                AttentionState::class,
                AttentionFilter::class,
                DocumentFilters::class,
                PublicationCard::class,
                DocumentView::class,
                PublicationList::class,
                ReportView::class,
            )
            ->commands(
                CreateDocument::class,
                CreateReport::class,
                OpenDocument::class,
                ReplaceDocumentBody::class,
                EditDocument::class,
                ReplaceDocumentText::class,
                ChangeDocumentDetails::class,
                CloseDocument::class,
                SettleDocument::class,
                CloseReport::class,
                RecoverDocument::class,
            )
            ->exceptions(
                SettlementDenied::class,
                StaleRead::class,
                DraftMissing::class,
                DraftHeld::class,
                DraftConflict::class,
                DocumentMissing::class,
                ReportMissing::class,
            )
            ->build();
    }

    public function numberedModels(): array
    {
        return [
            NumberedModel::global(Document::class),
            NumberedModel::within(DocumentRevision::class, Document::class),
            NumberedModel::global(Report::class),
        ];
    }

    public function linkRecords(): array
    {
        return [Document::LINK_TYPE => DocumentLinkRecords::class, Report::LINK_TYPE => ReportLinkRecords::class];
    }

    /**
     * Closed documents and filed reports may be shared, as roots or as linked records the owner selects.
     */
    public function shareRecords(): array
    {
        return [
            new ShareRecordDefinition(
                Document::LINK_TYPE,
                Document::class,
                DocumentShareProvider::class,
                [self::SHARE_LINKED_RECORD],
            ),
            new ShareRecordDefinition(
                Report::LINK_TYPE,
                Report::class,
                ReportShareProvider::class,
                [self::SHARE_LINKED_RECORD],
            ),
        ];
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                DocumentPolicy::class,
                [AccessType::Create, AccessType::Edit],
            ),
            new PolicyDefinition(
                DocumentAdministrationPolicy::class,
                [AccessType::Edit],
            ),
            new PolicyDefinition(
                ReportPolicy::class,
                [AccessType::Create, AccessType::Edit],
            ),
            new PolicyDefinition(
                UploadPolicy::class,
                [AccessType::Create, AccessType::Edit],
            ),
        ];
    }

    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands', Command::class);
    }

    public function mcpTools(): array
    {
        return FolderClasses::in(__DIR__.'/Mcp', JournalTool::class);
    }

    public function mcpResources(): array
    {
        return FolderClasses::in(__DIR__.'/Mcp', JournalResource::class);
    }

    public function overviewContributions(): array
    {
        return [OpenReportsOverview::class];
    }

    public function searchContributions(): array
    {
        return [DocumentSearch::class, ReportSearch::class];
    }

    /**
     * The native parts the record layouts mount: a record's comments, its links and its share control, the form
     * that files a new one, and a document's draft editor and the form that recovers a held draft.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return [
            'CreateRecordForm.vue',
            'DraftEditor.vue',
            'RecordComments.vue',
            'RecordLinks.vue',
            'RecordShare.vue',
            'RecoverForm.vue',
            'ReportReceipt.vue',
        ];
    }

    public function pages(): array
    {
        return [
            Page::layout('library', 'Documents', Icon::Docs, LibraryWindowResolver::class)
                ->at('')
                ->actions(
                    ActionRoute::post('docs', CreateDocumentPageController::class, 'create-document'),
                    ActionRoute::post('reports', CreateReportPageController::class, 'create-report'),
                ),
            Page::layout('document', 'Document', Icon::Docs, DocumentWindowResolver::class)
                ->at('docs/{document}')
                ->inInspector()
                ->actions(
                    ActionRoute::post('docs/{document}/open', OpenDocumentPageController::class, 'open-document'),
                    ActionRoute::post('docs/{document}/save', SaveDraftPageController::class, 'save-draft'),
                    ActionRoute::post('docs/{document}/close', CloseDraftPageController::class, 'close-draft'),
                    ActionRoute::post('docs/{document}/settle', SettleDocumentPageController::class, 'settle-document'),
                    ActionRoute::post('docs/{document}/recover', RecoverDocumentPageController::class, 'recover-draft'),
                )
                ->slots(Slot::record('inspector', 'document', 'doc')),
            Page::layout('revision', 'Revision', Icon::Docs, RevisionWindowResolver::class)
                ->at('docs/{document}/revisions/{revision}'),
            Page::layout('report', 'Report', Icon::Docs, ReportWindowResolver::class)
                ->at('reports/{report}')
                ->actions(
                    ActionRoute::post('reports/{report}/settle', SettleReportPageController::class, 'settle-report'),
                ),
        ];
    }

    public function sections(): array
    {
        return [
            Section::make(
                'records',
                'Documents and reports',
                'chat.dock',
                SlotContextType::Session,
                DocumentDockResolver::class,
                'DocumentDock.vue',
            ),
        ];
    }

    /**
     * The actions menu of one document, opened from its actions button on its page or its row in the library, or by a
     * right click on the row; other domains may join it by its full key, documents.document-actions.
     */
    public function menus(): array
    {
        return [Menu::record('document-actions', 'Document actions', 'document')];
    }

    public function menuItems(): array
    {
        return [
            MenuItem::opens('document-links', 'Links', self::DOCUMENT_ACTIONS, 'document', ['tab' => 'links'])
                ->inGroup('open', 10),
            MenuItem::opens('document-history', 'History', self::DOCUMENT_ACTIONS, 'document', ['tab' => 'history'])
                ->inGroup('open', 20),
            MenuItem::sends('document-edit', 'Edit', self::DOCUMENT_ACTIONS, 'open-document')
                ->inGroup('edit', 30),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('library', 'Documents', Icon::Docs, position: 30),
        ];
    }
}

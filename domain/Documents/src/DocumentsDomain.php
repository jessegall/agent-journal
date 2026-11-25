<?php

declare(strict_types=1);

namespace Domain\Documents;

use App\Concerns\HasLinkRecords;
use App\Contracts\Authorization\PolicyProvider;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandProvider;
use App\Contracts\Drivers\NativePartProvider;
use App\Contracts\Navigation\DraftProducerProvider;
use App\Contracts\Navigation\MenuProvider;
use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Navigation\SectionProvider;
use App\Contracts\Records\LinkRecordProvider;
use App\Contracts\Sharing\ShareRecordContributor;
use App\Declarations\ActionRoute;
use App\Declarations\Menu;
use App\Declarations\MenuItem;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Declarations\Section;
use App\Declarations\Slot;
use App\Enums\AccessType;
use App\Enums\Icon;
use App\Enums\SlotContextType;
use App\Mcp\Contracts\McpToolProvider;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalTool;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Support\Searchable;
use App\Support\ShareRecordDefinition;
use App\Values\PolicyDefinition;
use Domain\Chat\ChatDomain;
use Domain\Documents\Commands\ChangeDocumentDetails\ChangeDocumentDetailsCommand;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\RecoverDocument\RecoverDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentBody\ReplaceDocumentBodyCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Commands\SettleDocument\SettleDocumentCommand;
use Domain\Documents\Contracts\Attachments\AttachmentReader;
use Domain\Documents\Contracts\Documents\DocumentReader;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Drafts\DraftReader;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Contracts\Reports\ReportReader;
use Domain\Documents\Contracts\Reports\ReportResolver;
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
use Domain\Documents\Events\DocumentClosed;
use Domain\Documents\Events\DocumentCreated;
use Domain\Documents\Events\DocumentDraftSaved;
use Domain\Documents\Events\DocumentOpened;
use Domain\Documents\Events\DocumentPublished;
use Domain\Documents\Events\DraftKept;
use Domain\Documents\Events\RecordSettled;
use Domain\Documents\Events\ReportFiled;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Exceptions\DraftHeld;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Exceptions\SettlementDenied;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Http\Controllers\AskDocumentFeedbackPageController;
use Domain\Documents\Http\Controllers\CloseDraftPageController;
use Domain\Documents\Http\Controllers\CreateDocumentPageController;
use Domain\Documents\Http\Controllers\CreateReportPageController;
use Domain\Documents\Http\Controllers\OpenDocumentPageController;
use Domain\Documents\Http\Controllers\RecoverDocumentPageController;
use Domain\Documents\Http\Controllers\SaveDraftPageController;
use Domain\Documents\Http\Controllers\SettleDocumentPageController;
use Domain\Documents\Http\Controllers\SettleReportPageController;
use Domain\Documents\Http\Pages\Resolvers\DocumentDockResolver;
use Domain\Documents\Http\Pages\Resolvers\DocumentWindowResolver;
use Domain\Documents\Http\Pages\Resolvers\LibraryWindowResolver;
use Domain\Documents\Http\Pages\Resolvers\ReportWindowResolver;
use Domain\Documents\Http\Pages\Resolvers\RevisionWindowResolver;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Domain\Documents\Policies\DocumentAdministrationPolicy;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Policies\ReportPolicy;
use Domain\Documents\Policies\UploadPolicy;
use Domain\Documents\Support\DocumentDraftProducer;
use Domain\Documents\Support\DocumentReferenceRecognizer;
use Domain\Documents\Support\DocumentSearchAccess;
use Domain\Documents\Support\DocumentSearchProvider;
use Domain\Documents\Support\DocumentShareProvider;
use Domain\Documents\Support\Links\DocumentLinkRecords;
use Domain\Documents\Support\Links\ReportLinkRecords;
use Domain\Documents\Support\Mcp\OpenReportsOverview;
use Domain\Documents\Support\ReportReferenceRecognizer;
use Domain\Documents\Support\ReportSearchAccess;
use Domain\Documents\Support\ReportSearchProvider;
use Domain\Documents\Support\ReportShareProvider;
use Domain\Documents\Values\CloseResult;
use Domain\Documents\Values\CreatedRecord;
use Domain\Documents\Values\DraftReference;
use Domain\Documents\Values\DraftTarget;
use Domain\Documents\Values\RetainedDraftView;

final class DocumentsDomain extends Domain implements
    CommandProvider,
    DraftProducerProvider,
    LinkRecordProvider,
    McpToolProvider,
    MenuProvider,
    NativePartProvider,
    NavigationProvider,
    PageProvider,
    PolicyProvider,
    SectionProvider,
    ShareRecordContributor
{
    use HasLinkRecords;

    /**
     * The full key of a document's actions menu.
     */
    public const string DOCUMENT_ACTIONS = 'documents.document-actions';

    private const string SHARE_LINKED_RECORD = 'share-linked-record';

    public function description(): string
    {
        return 'Documents that keep every revision of their text, and reports filed once.';
    }

    public function draftProducers(): array
    {
        return ['document' => DocumentDraftProducer::class];
    }

    public function requires(): array
    {
        return [ChatDomain::class];
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
                CreateDocumentCommand::class,
                CreateReportCommand::class,
                OpenDocumentCommand::class,
                ReplaceDocumentBodyCommand::class,
                EditDocumentCommand::class,
                ReplaceDocumentTextCommand::class,
                ChangeDocumentDetailsCommand::class,
                CloseDocumentCommand::class,
                SettleDocumentCommand::class,
                CloseReportCommand::class,
                RecoverDocumentCommand::class,
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

    public function linkRecords(): array
    {
        return [
            Document::LINK_TYPE => DocumentLinkRecords::class,
            Report::LINK_TYPE => ReportLinkRecords::class,
        ];
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
                [
                    AccessType::Create,
                    AccessType::Edit,
                ],
            ),
            new PolicyDefinition(
                DocumentAdministrationPolicy::class,
                [AccessType::Edit],
            ),
            new PolicyDefinition(
                ReportPolicy::class,
                [
                    AccessType::Create,
                    AccessType::Edit,
                ],
            ),
            new PolicyDefinition(
                UploadPolicy::class,
                [
                    AccessType::Create,
                    AccessType::Edit,
                ],
            ),
        ];
    }

    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands/*', Command::class);
    }

    public function mcpTools(): array
    {
        return FolderClasses::in($this->mcpRoot('Tools'), JournalTool::class);
    }

    public function mcpResources(): array
    {
        return FolderClasses::in($this->mcpRoot('Resources'), JournalResource::class);
    }

    public function overviewContributions(): array
    {
        return [OpenReportsOverview::class];
    }

    public function searchables(): array
    {
        return [
            Searchable::make(
                'document',
                'Documents',
                DocumentSearchAccess::class,
                DocumentSearchProvider::class,
                DocumentReferenceRecognizer::class,
            ),
            Searchable::make(
                'report',
                'Reports',
                ReportSearchAccess::class,
                ReportSearchProvider::class,
                ReportReferenceRecognizer::class,
            ),
        ];
    }

    /**
     * The native parts the record layouts mount: a record's comments, a document's line comments, its links and its
     * share control, and a document's draft editor and the form that recovers a held draft.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return [
            'DocumentComments.vue',
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
                ->onHome(27)
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
                    ActionRoute::post('docs/{document}/feedback', AskDocumentFeedbackPageController::class, 'ask-feedback'),
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

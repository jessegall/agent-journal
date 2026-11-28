<?php

declare(strict_types=1);

namespace Domain\Documents;

use Domain\Documents\Data\DocumentsPaneData;
use Domain\Documents\Http\Pages\DocumentPageBuilder;
use Domain\Documents\Http\Pages\DocumentPageData;
use Domain\Documents\Http\Pages\LibraryPageBuilder;
use Domain\Documents\Http\Pages\LibraryPageData;
use Domain\Documents\Http\Pages\ReportPageBuilder;
use Domain\Documents\Http\Pages\ReportPageData;
use Domain\Documents\Http\Pages\RevisionPageBuilder;
use Domain\Documents\Http\Pages\RevisionPageData;
use Domain\Documents\Http\Windows\DocumentsWindowBuilder;
use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Agents\Enums\AccessType;
use App\Concerns\HasLinkRecords;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Declarations\PageSlots;
use App\Mcp\Contracts\McpToolProvider;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalTool;
use App\Navigation\Contracts\DraftProducerProvider;
use App\Navigation\Contracts\MenuProvider;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Contracts\SectionProvider;
use App\Navigation\Declarations\Menu;
use App\Navigation\Declarations\MenuItem;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Profiles\Enums\SlotContextType;
use App\Records\Contracts\LinkRecordProvider;
use App\Records\Contracts\ShareRecordContributor;
use App\Records\Values\ShareRecordDefinition;
use App\Support\ProjectCode;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\SearchSource;
use App\Text\Declarations\Section;
use Domain\Chat\ChatDomain;
use Domain\Comments\CommentsDomain;
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
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Data\RevisionCard;
use Domain\Documents\Data\RevisionView;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\AttentionStatus;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Enums\EditingStatus;
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
        return [
            ChatDomain::class,
            CommentsDomain::class,
        ];
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
                EditingStatus::class,
                DraftState::class,
                DraftView::class,
                RevisionCard::class,
                RevisionView::class,
                DraftReference::class,
                RetainedDraftView::class,
                DraftTarget::class,
                CloseResult::class,
                CloseCause::class,
                CreatedRecord::class,
                AttentionStatus::class,
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
            Document::linkType() => DocumentLinkRecords::class,
            Report::linkType() => ReportLinkRecords::class,
        ];
    }

    /**
     * Closed documents and filed reports may be shared, as roots or as linked records the owner selects.
     */
    public function shareRecords(): array
    {
        return [
            new ShareRecordDefinition(
                Document::linkType(),
                Document::class,
                DocumentShareProvider::class,
                [self::SHARE_LINKED_RECORD],
            ),
            new ShareRecordDefinition(
                Report::linkType(),
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

    public function mcpTools(): array
    {
        return ProjectCode::in($this->mcpRoot('Tools'), JournalTool::class);
    }

    public function mcpResources(): array
    {
        return ProjectCode::in($this->mcpRoot('Resources'), JournalResource::class);
    }

    public function overviewContributions(): array
    {
        return [OpenReportsOverview::class];
    }

    public function searchables(): array
    {
        return [
            SearchSource::make(
                'document',
                'Documents',
                DocumentSearchAccess::class,
                DocumentSearchProvider::class,
                DocumentReferenceRecognizer::class,
            ),
            SearchSource::make(
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
            'RecordLinks.vue',
            'RecordShare.vue',
            'RecoverForm.vue',
            'ReportReceipt.vue',
        ];
    }

    public function pages(): array
    {
        return [
            Page::build()
                ->key('library')
                ->title('Documents')
                ->icon(Icon::Docs)
                ->pageType(LibraryPageData::class)
                ->pageBuilder(LibraryPageBuilder::class)
                ->declaredLayout()
                ->withWindow(DocumentsPaneData::class, DocumentsWindowBuilder::class, 'DocumentsPane.vue')
                ->finish()
                ->at('')
                ->onHome(27)
                ->actions(fn (PageActions $actions) => $actions
                    ->post('docs', CreateDocumentPageController::class, 'create-document')
                    ->post('reports', CreateReportPageController::class, 'create-report')),
            Page::build()
                ->key('document')
                ->title('Document')
                ->icon(Icon::Docs)
                ->pageType(DocumentPageData::class)
                ->pageBuilder(DocumentPageBuilder::class)
                ->declaredLayout()
                ->finish()
                ->at('docs/{document}')
                ->inInspector()
                ->actions(fn (PageActions $actions) => $actions
                    ->post('docs/{document}/open', OpenDocumentPageController::class, 'open-document')
                    ->post('docs/{document}/save', SaveDraftPageController::class, 'save-draft')
                    ->post('docs/{document}/close', CloseDraftPageController::class, 'close-draft')
                    ->post('docs/{document}/settle', SettleDocumentPageController::class, 'settle-document')
                    ->post('docs/{document}/recover', RecoverDocumentPageController::class, 'recover-draft')
                    ->post(
                        'docs/{document}/feedback',
                        AskDocumentFeedbackPageController::class,
                        'ask-feedback',
                    ))
                ->slots(fn (PageSlots $slots) => $slots->record('inspector', 'document', 'doc')),
            Page::build()
                ->key('revision')
                ->title('Revision')
                ->icon(Icon::Docs)
                ->pageType(RevisionPageData::class)
                ->pageBuilder(RevisionPageBuilder::class)
                ->declaredLayout()
                ->finish()
                ->at('docs/{document}/revisions/{revision}'),
            Page::build()
                ->key('report')
                ->title('Report')
                ->icon(Icon::Docs)
                ->pageType(ReportPageData::class)
                ->pageBuilder(ReportPageBuilder::class)
                ->declaredLayout()
                ->finish()
                ->at('reports/{report}')
                ->actions(fn (PageActions $actions) => $actions
                    ->post('reports/{report}/settle', SettleReportPageController::class, 'settle-report')),
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

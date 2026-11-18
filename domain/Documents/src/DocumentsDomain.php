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
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Api\Events\DocumentCreated;
use Domain\Documents\Api\Events\ReportFiled;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\DocumentCard;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\DocumentList;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\ReportCard;
use Domain\Documents\Data\ReportList;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Exceptions\ContentMissing;
use Domain\Documents\Exceptions\ContentTooLarge;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Exceptions\MarkdownInvalid;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Http\Controllers\CreateDocumentPageController;
use Domain\Documents\Http\Controllers\CreateReportPageController;
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
            ->events(DocumentCreated::class, ReportFiled::class)
            ->contracts(DocumentReader::class, ReportReader::class)
            ->values(CreatedRecord::class, AttentionState::class, AttentionFilter::class, DocumentFilters::class, DocumentCard::class, DocumentView::class, DocumentList::class, ReportCard::class, ReportView::class, ReportList::class)
            ->commands(CreateDocument::class, CreateReport::class)
            ->exceptions(ContentMissing::class, ContentTooLarge::class, MarkdownInvalid::class, DocumentMissing::class, ReportMissing::class)
            ->build();
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Document::class), NumberedModel::within(DocumentRevision::class, Document::class), NumberedModel::global(Report::class)];
    }

    public function commands(): array
    {
        return [CreateDocument::class, CreateReport::class];
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
            Page::make('document', 'Document', Icon::Docs, DocumentWindowReader::class, 'RecordWindow.vue')
                ->at('docs/{document}')
                ->inInspector()
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

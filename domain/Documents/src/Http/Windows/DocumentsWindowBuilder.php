<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Windows;

use App\Reads\PageFormRequests;
use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use Domain\Documents\Data\DocumentsPaneData;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\LibraryTypeFilter;
use Domain\Documents\Http\Requests\ListRecordsRequest;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Illuminate\Http\Request;

final readonly class DocumentsWindowBuilder implements WindowBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private SurfaceAttributeMap $policies,
        private DocumentResolver $documents,
        private ReportResolver $reports,
    ) {}

    public function build(Request $visit): DocumentsPaneData
    {
        $input = $this->requests->from(ListRecordsRequest::class, $visit);
        $filters = $input->filters();
        $type = $input->typeFilter();
        $policy = $this->policies->forType(DocumentsPaneData::class);
        $limit = $policy->limitFor('items');

        $documents = $type->isForDocuments() ? $this->documents->preview($filters, $limit)->all() : [];
        $reports = $type->isForReports() ? $this->reports->preview($filters, $limit)->all() : [];
        $recent = [
            ...$documents,
            ...$reports,
        ];
        usort($recent, fn (Document|Report $left, Document|Report $right) => strcmp($right->id, $left->id));
        $items = array_map($this->row(...), array_slice($recent, 0, $limit));

        $query = array_filter([
            'attention' => $filters->attention === AttentionFilter::Active ? null : $filters->attention->value,
            'type' => $type === LibraryTypeFilter::All ? null : $type->value,
            'query' => $filters->query,
            'revisions' => $filters->revisions ? 1 : null,
        ], fn (mixed $value) => $value !== null && $value !== '');

        return DocumentsPaneData::build()
            ->items($items)
            ->fullUrl(route('documents.library', $query, false))
            ->finish();
    }

    private function row(Document|Report $record): LayoutRowData
    {
        $document = $record instanceof Document;

        return LayoutRowData::build()
            ->key($record->id)
            ->label($document ? $record->currentRevision->title : $record->title)
            ->value($document ? 'Document' : 'Report')
            ->href($document
                ? route('documents.document', ['document' => $record->number], false)
                : route('documents.report', ['report' => $record->number], false))
            ->finish();
    }
}

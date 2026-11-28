<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Windows;

use App\Reads\PageFormRequests;
use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Data\DocumentsPaneData;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\LibraryTypeFilter;
use Domain\Documents\Http\Requests\ListRecordsRequest;
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
        $input = $this->requests->forVisit(ListRecordsRequest::class, $visit);
        $filters = $input->filters();
        $type = $input->typeFilter();
        $policy = $this->policies->forType(DocumentsPaneData::class);
        $limit = $policy->limitFor('items');

        $documents = $type->isForDocuments() ? $this->documents->preview($filters, $limit) : [];
        $reports = $type->isForReports() ? $this->reports->preview($filters, $limit) : [];

        $recent = [
            ...$documents,
            ...$reports,
        ];

        usort($recent, fn (LayoutRowData $left, LayoutRowData $right) => strcmp($right->key, $left->key));
        $items = array_slice($recent, 0, $limit);

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
}

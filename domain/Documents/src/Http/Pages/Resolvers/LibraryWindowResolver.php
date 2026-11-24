<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Http\Pages\Documents\DocumentsIndex;
use Domain\Documents\Http\Requests\ListRecordsRequest;

/**
 * The library: one page of its documents, its reports or both, as the type choice asks, under the search and attention
 * filters of the window's query.
 */
final readonly class LibraryWindowResolver implements PageResolver
{
    public function __construct(
        private DocumentResolver $documents,
        private ReportResolver $reports,
        private ListRecordsRequest $request,
        private DocumentsIndex $page,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $filters = $this->request->filters();
        $type = $this->request->typeFilter();
        $documents = $type->isForDocuments() ? $this->documents->list($filters) : null;
        $reports = $type->isForReports() ? $this->reports->list($filters) : null;

        return $this->page->of($filters, $type, $documents, $reports);
    }
}

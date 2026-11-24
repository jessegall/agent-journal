<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Resolvers\Support;

use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Http\Pages\Documents\DocumentsIndex;
use Domain\Documents\Http\Requests\ListRecordsRequest;

/**
 * The library as the window's query asks for it: one page of its documents, its reports or both under the search and
 * attention filters, with the parts given in its reader.
 */
final readonly class LibraryListing
{
    public function __construct(
        private DocumentResolver $documents,
        private ReportResolver $reports,
        private ListRecordsRequest $request,
        private DocumentsIndex $page,
    ) {}

    public function layout(LayoutPartData ...$reader): DeclaredLayoutData
    {
        $filters = $this->request->filters();
        $type = $this->request->typeFilter();
        $documents = $type->isForDocuments() ? $this->documents->list($filters) : null;
        $reports = $type->isForReports() ? $this->reports->list($filters) : null;

        return $this->page->of($filters, $type, $documents, $reports, ...$reader);
    }
}

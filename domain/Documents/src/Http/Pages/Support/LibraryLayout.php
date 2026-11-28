<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Support;

use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Enums\LibraryTypeFilter;
use Domain\Documents\Http\Pages\Documents\DocumentsIndex;

/**
 * The library as the window's query asks for it: one page of its documents, its reports or both under the search and
 * attention filters, with the parts given in its reader.
 */
final readonly class LibraryLayout
{
    public function __construct(
        private DocumentResolver $documents,
        private ReportResolver $reports,
        private DocumentsIndex $page,
    ) {}

    public function layout(
        DocumentFilters $filters,
        LibraryTypeFilter $type,
        LayoutPartData ...$reader,
    ): DeclaredLayoutData {
        $documents = $type->isForDocuments() ? $this->documents->list($filters) : null;
        $reports = $type->isForReports() ? $this->reports->list($filters) : null;

        return $this->page->of($filters, $type, $documents, $reports, ...$reader);
    }
}

<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages;

use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Documents\Http\Pages\Support\LibraryListing;
use Domain\Documents\Http\Requests\ListRecordsRequest;
use Illuminate\Http\Request;

/**
 * The library: one page of its documents, its reports or both, as the type choice asks, under the search and attention
 * filters of the window's query.
 */
final readonly class LibraryPageBuilder implements PageBuilder
{
    public function __construct(private LibraryListing $library, private PageFormRequests $requests) {}

    public function build(Request $visit): LibraryPageData
    {
        $input = $this->requests->from(ListRecordsRequest::class, $visit);

        return LibraryPageData::build()
            ->shown($this->library->layout($input->filters(), $input->typeFilter()))
            ->finish();
    }
}

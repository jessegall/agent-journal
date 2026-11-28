<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Resolvers;

use App\Navigation\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Documents\Http\Pages\Support\LibraryListing;
use Domain\Documents\Http\Requests\ListRecordsRequest;

/**
 * The library: one page of its documents, its reports or both, as the type choice asks, under the search and attention
 * filters of the window's query.
 */
final readonly class LibraryWindowResolver implements PageResolver
{
    public function __construct(private LibraryListing $library, private ListRecordsRequest $request) {}

    public function read(): DeclaredLayoutData
    {
        return $this->library->layout($this->request->filters(), $this->request->typeFilter());
    }
}

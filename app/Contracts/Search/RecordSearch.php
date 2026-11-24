<?php

declare(strict_types=1);

namespace App\Contracts\Search;

use App\Values\SearchAnswer;
use App\Values\SearchOwner;
use App\Values\SearchReader;
use App\Values\SearchRequest;

/**
 * One search across every declared source the reader may search: a fresh search, its continuation or a discovery.
 */
interface RecordSearch
{
    /**
     * The records of the owner that match the request and that the reader may see.
     */
    public function search(SearchOwner $owner, SearchReader $reader, SearchRequest $request): SearchAnswer;
}

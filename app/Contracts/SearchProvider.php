<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\SearchBatch;
use App\Values\SearchQuery;

/**
 * A domain's search over one searchable: it answers a query, or a RefreshCandidates query, with one batch. A
 * closure declared in its place takes the same query and returns the same batch. It charges its work against the
 * query's budget before each read and reads only what the reader's grant admits.
 */
interface SearchProvider
{
    public function search(SearchQuery $query): SearchBatch;
}

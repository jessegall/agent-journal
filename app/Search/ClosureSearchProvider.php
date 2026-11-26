<?php

declare(strict_types=1);

namespace App\Search;

use App\Search\Contracts\SearchProvider;
use App\Search\Values\RefreshCandidates;
use App\Search\Values\SearchBatch;
use App\Search\Values\SearchQuery;
use Closure;

/**
 * A small provider a domain declared as a closure, asked the same way as a provider class, in request scope.
 */
final readonly class ClosureSearchProvider implements SearchProvider
{
    public function __construct(private Closure $search) {}

    public function search(SearchQuery|RefreshCandidates $query): SearchBatch
    {
        return ($this->search)($query);
    }
}

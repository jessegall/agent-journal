<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\SearchProvider;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use Closure;

/**
 * A small provider a domain declared as a closure, asked the same way as a provider class, in request scope.
 */
final readonly class ClosureSearchProvider implements SearchProvider
{
    public function __construct(private Closure $search) {}

    public function search(SearchQuery $query): SearchBatch
    {
        return ($this->search)($query);
    }
}

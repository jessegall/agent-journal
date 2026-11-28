<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Searching\Logs;

use App\Search\Values\RefreshCandidates;
use App\Search\Values\SearchBatch;
use App\Search\Values\SearchQuery;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\SearchSource;
use Tests\Fixtures\Search\ClosedSearchAccess;

/**
 * A fixture domain whose log lines only an agent with logs_read may search, labelled Tasks like the Tasks domain.
 */
final class LogsDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain whose log lines can be searched by agents only.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }

    public function searchables(): array
    {
        return [
            SearchSource::make(
                'line',
                'Tasks',
                ClosedSearchAccess::class,
                fn (SearchQuery|RefreshCandidates $query): SearchBatch => SearchBatch::exhausted('1', []),
            ),
        ];
    }
}

<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Searching\Tasks;

use App\Support\Domain;
use App\Support\Exports;
use App\Support\Searchable;
use App\Values\SearchBatch;
use App\Values\RefreshCandidates;
use App\Values\SearchQuery;
use Tests\Fixtures\Search\OpenSearchAccess;

/**
 * A fixture domain that offers its tasks to search as tasks.task.
 */
final class TasksDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain whose tasks can be searched.';
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
            Searchable::make(
                'task',
                'Tasks',
                OpenSearchAccess::class,
                fn (SearchQuery|RefreshCandidates $query): SearchBatch => SearchBatch::exhausted('1', []),
            ),
        ];
    }
}

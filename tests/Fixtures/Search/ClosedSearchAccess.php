<?php

declare(strict_types=1);

namespace Tests\Fixtures\Search;

use App\Search\Contracts\SearchAccess;
use App\Search\Values\AdmittedConstraints;
use App\Search\Values\OpenAction;
use App\Search\Values\RecordLocation;
use App\Search\Values\SearchReader;
use App\Support\ActorReference;
use App\Values\ReadRequest;

/**
 * A search policy that asks agents for logs_read and lets no signed-in user search.
 */
final class ClosedSearchAccess implements SearchAccess
{
    public function agentRead(): ReadRequest
    {
        return ReadRequest::forDiscovery('logs_read');
    }

    public function canUserSearch(ActorReference $user): bool
    {
        return false;
    }

    public function constraints(SearchReader $reader): AdmittedConstraints
    {
        return AdmittedConstraints::unrestricted();
    }

    public function admitsOpen(SearchReader $reader, string $recordId): bool
    {
        return $reader->isAgent();
    }

    public function openAction(string $recordId, RecordLocation|null $location): OpenAction
    {
        return new OpenAction('logs_read', ['line_id' => $recordId]);
    }

    public function pageQuery(RecordLocation|null $location): array
    {
        return [];
    }
}

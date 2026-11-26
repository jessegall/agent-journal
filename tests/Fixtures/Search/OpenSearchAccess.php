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
 * A search policy that asks agents for tasks_read and lets every signed-in user search.
 */
final class OpenSearchAccess implements SearchAccess
{
    public function agentRead(): ReadRequest
    {
        return ReadRequest::forDiscovery('tasks_read');
    }

    public function canUserSearch(ActorReference $user): bool
    {
        return true;
    }

    public function constraints(SearchReader $reader): AdmittedConstraints
    {
        return AdmittedConstraints::unrestricted();
    }

    public function admitsOpen(SearchReader $reader, string $recordId): bool
    {
        return true;
    }

    public function openAction(string $recordId, RecordLocation|null $location): OpenAction
    {
        return new OpenAction('tasks_read', ['task_id' => $recordId]);
    }

    public function pageQuery(RecordLocation|null $location): array
    {
        return [];
    }
}

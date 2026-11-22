<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Contracts\ReadGrant;
use App\Contracts\SearchAccess;
use App\Support\ActorContext;
use App\Values\AdmittedConstraints;
use App\Values\AllowedNames;
use App\Values\OpenAction;
use App\Values\ReadRequest;
use App\Values\RecordLocation;
use App\Values\SearchReader;
use Domain\Tasks\Support\Mcp\TaskReadResult;

/**
 * Who may search tasks: an agent whose grant holds tasks_read for at least one task, limited to the tasks it holds
 * it for, and every signed-in user of the environment, who reads all its tasks.
 */
final readonly class TaskSearchAccess implements SearchAccess
{
    public function __construct(private ReadGrant $reads) {}

    public function agentRead(): ReadRequest
    {
        return ReadRequest::forDiscovery(TaskReadResult::TOOL);
    }

    public function canUserSearch(ActorContext $user): bool
    {
        return true;
    }

    /**
     * The task ids the reader's grant names, compiled once for the batch; views, fields and passages are those the
     * tasks_read projection shows, so they stay unrestricted.
     */
    public function constraints(SearchReader $reader): AdmittedConstraints
    {
        if (! $reader->isAgent()) {
            return AdmittedConstraints::unrestricted();
        }

        return new AdmittedConstraints(
            $this->reads->allowedTargets(TaskReadResult::TOOL),
            AllowedNames::all(),
            AllowedNames::all(),
            AllowedNames::all(),
        );
    }

    public function admitsOpen(SearchReader $reader, string $recordId): bool
    {
        if (! $reader->isAgent()) {
            return true;
        }

        return $this->reads->allows(TaskReadResult::requestFor($recordId));
    }

    /**
     * The task summary through tasks_read, or for a brief passage the same read opened at that passage.
     */
    public function openAction(string $recordId, RecordLocation|null $location): OpenAction
    {
        if ($location === null) {
            return new OpenAction(TaskReadResult::TOOL, ['task_id' => $recordId]);
        }

        return new OpenAction(TaskReadResult::TOOL, ['task_id' => $recordId, 'passage' => $location->id]);
    }
}

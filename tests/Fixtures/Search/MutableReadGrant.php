<?php

declare(strict_types=1);

namespace Tests\Fixtures\Search;

use App\Contracts\ReadGrant;
use App\Exceptions\ReadGrantRefused;
use App\Values\AllowedNames;
use App\Values\ReadRequest;

/**
 * An agent's tasks_read grant scoped to the task ids it holds now; a test revokes one between two calls.
 */
final class MutableReadGrant implements ReadGrant
{
    /**
     * @param  list<string>  $taskIds
     */
    public function __construct(private array $taskIds) {}

    public function revoke(string $taskId): void
    {
        $this->taskIds = array_values(array_diff($this->taskIds, [$taskId]));
    }

    public function allows(ReadRequest $request): bool
    {
        if ($request->discovery) {
            return $this->taskIds !== [];
        }

        return $request->target !== null && in_array($request->target, $this->taskIds, true);
    }

    public function assertAllowed(ReadRequest $request): void
    {
        if (! $this->allows($request)) {
            throw ReadGrantRefused::because('not granted');
        }
    }

    public function allowedTargets(string $name): AllowedNames
    {
        return AllowedNames::only($this->taskIds);
    }
}

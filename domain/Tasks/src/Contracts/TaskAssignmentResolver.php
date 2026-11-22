<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use App\Support\RecordIdentity;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Values\TaskAssignmentCompletion;

/**
 * What another domain needs of tasks to assign their work: their record identities and, per group, how many are over.
 * Each call reads its tasks in one query and refuses a missing task.
 */
interface TaskAssignmentResolver
{
    /**
     * @param  list<string>  $taskIds
     * @return list<RecordIdentity>
     *
     * @throws TaskMissing
     */
    public function records(array $taskIds): array;

    /**
     * @template TKey of array-key
     *
     * @param  array<TKey, list<string>>  $taskGroups
     * @return array<TKey, TaskAssignmentCompletion>
     *
     * @throws TaskMissing
     */
    public function completionOf(array $taskGroups): array;
}

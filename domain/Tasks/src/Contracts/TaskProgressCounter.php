<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use Domain\Tasks\Api\TaskProgress;

/**
 * Counts how far tasks named by id have got, for a domain that groups tasks without reading them.
 */
interface TaskProgressCounter
{
    /**
     * @param  list<string>  $taskIds
     */
    public function progressOf(array $taskIds): TaskProgress;

    /**
     * @template TKey of array-key
     *
     * @param  array<TKey, list<string>>  $taskIdGroups
     * @return array<TKey, TaskProgress>
     */
    public function progressByGroup(array $taskIdGroups): array;
}

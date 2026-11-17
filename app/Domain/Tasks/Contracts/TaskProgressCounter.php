<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Contracts;

use App\Domain\Tasks\TaskCounts;
use App\Domain\Tasks\TaskProgress;
use Illuminate\Container\Attributes\Bind;

/**
 * Counts how far tasks named by id have got, for a domain that groups tasks without reading them.
 */
#[Bind(TaskCounts::class)]
interface TaskProgressCounter
{
    /**
     * @param  list<int>  $taskIds
     */
    public function progressOf(array $taskIds): TaskProgress;

    /**
     * @template TKey of array-key
     *
     * @param  array<TKey, list<int>>  $taskIdGroups
     * @return array<TKey, TaskProgress>
     */
    public function progressByGroup(array $taskIdGroups): array;
}

<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use Domain\Tasks\Values\TaskProgress;

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
     * How far the tasks a write is placing have got, counted inside that write for the tallies it keeps; it reads no
     * text and answers no caller, so it asks for no actor.
     *
     * @param  list<string>  $taskIds
     */
    public function progressOfPlaced(array $taskIds): TaskProgress;

    /**
     * @template TKey of array-key
     *
     * @param  array<TKey, list<string>>  $taskIdGroups
     * @return array<TKey, TaskProgress>
     */
    public function progressByGroup(array $taskIdGroups): array;
}

<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use Domain\Tasks\Models\Task;

/**
 * Serialises every change of the graph of waits: first the lock of each environment the two tasks belong to, in
 * order, held to the end of the transaction, then the two task rows in the order of their ids. Two changes that could
 * make a cycle together never pass their checks at the same time.
 */
final readonly class TaskGraphLock
{
    /**
     * @return array{0: Task, 1: Task|null} the dependent and the prerequisite, both locked; no prerequisite when that
     *                                      task is gone and only its wait remains
     */
    public function lock(string $dependentId, string $prerequisiteId): array
    {
        $locked = $this->lockAll([
            $dependentId,
            $prerequisiteId,
        ]);

        return [
            $locked[$dependentId] ?? Task::lockedById($dependentId),
            $locked[$prerequisiteId] ?? null,
        ];
    }

    /**
     * Locks the wait graphs of every environment these tasks are in, then each task row by id ascending: the one order
     * every wait change takes, so two changes never wait on each other.
     *
     * @param  list<string>  $ids
     * @return array<string, Task> the tasks by id, locked
     */
    public function lockAll(array $ids): array
    {
        $unique = array_values(array_unique($ids));

        $environmentOf = Task::query()->whereKey($unique)
            ->readExactly(count($unique))->pluck('environment_id', 'id')->all();

        Task::lockWaitGraphs(array_values(array_map(strval(...), $environmentOf)));

        $sorted = array_map(strval(...), array_keys($environmentOf));
        sort($sorted);
        $locked = [];

        foreach ($sorted as $id) {
            $locked[$id] = Task::lockedById($id);
        }

        return $locked;
    }
}

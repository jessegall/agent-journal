<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use Domain\Tasks\Models\Task;
use Illuminate\Database\ConnectionInterface;

/**
 * Serialises every change of the graph of waits: first the lock of each environment the two tasks belong to, in
 * order, held to the end of the transaction, then the two task rows in the order of their ids. Two changes that could
 * make a cycle together never pass their checks at the same time.
 */
final readonly class TaskGraphLock
{
    public function __construct(private ConnectionInterface $database) {}

    /**
     * @return array{0: Task, 1: Task|null} the dependent and the prerequisite, both locked; no prerequisite when that
     *                                      task is gone and only its wait remains
     */
    public function lock(string $dependentId, string $prerequisiteId): array
    {
        $environmentOf = Task::query()->whereKey([$dependentId, $prerequisiteId])
            ->readExactly(2)->pluck('environment_id', 'id')->all();
        $environments = array_values(array_unique(array_map(strval(...), $environmentOf)));
        sort($environments);

        foreach ($environments as $environment) {
            $this->database->select('select pg_advisory_xact_lock(hashtext(?))', ["task-waits:{$environment}"]);
        }

        $ids = array_keys($environmentOf);
        sort($ids);
        $locked = [];

        foreach ($ids as $id) {
            $locked[$id] = Task::lockedById((string) $id);
        }

        return [$locked[$dependentId] ?? Task::lockedById($dependentId), $locked[$prerequisiteId] ?? null];
    }
}

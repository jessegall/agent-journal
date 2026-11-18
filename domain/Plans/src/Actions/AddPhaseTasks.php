<?php

declare(strict_types=1);

namespace Domain\Plans\Actions;

use Domain\Plans\Models\Phase;
use Domain\Tasks\Contracts\TaskReader;
use Illuminate\Database\ConnectionInterface;

/**
 * Puts tasks into a phase after Tasks confirmed, in one read, that every one of them exists for the actor of this
 * request; one missing task refuses the whole addition.
 */
final readonly class AddPhaseTasks
{
    public function __construct(
        private TaskReader $tasks,
        private ConnectionInterface $database,
    ) {}

    /**
     * @param  list<int>  $taskIds
     */
    public function add(Phase $phase, array $taskIds): void
    {
        $this->tasks->requireAllVisible($taskIds);

        $this->database->transaction(fn () => $phase->addTasks($taskIds));
    }
}

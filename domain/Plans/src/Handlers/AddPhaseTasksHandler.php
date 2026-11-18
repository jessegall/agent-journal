<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use Domain\Plans\Commands\AddPhaseTasks;
use Domain\Plans\Models\Phase;
use Domain\Tasks\Contracts\TaskReader;

/**
 * Adds the tasks once Tasks confirmed, in one read, that every one exists for the actor; one missing task refuses all.
 */
final readonly class AddPhaseTasksHandler
{
    public function __construct(
        private TaskReader $tasks,
    ) {}

    public function handle(AddPhaseTasks $command): void
    {
        $this->tasks->requireAllVisible($command->taskIds);

        Phase::query()->findOrFail($command->phaseId)->addTasks($command->taskIds);
    }
}

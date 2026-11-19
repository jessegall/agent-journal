<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Contracts\CommandHandler;
use Domain\Plans\Commands\AddPhaseTasks;
use Domain\Plans\Models\Phase;
use Domain\Tasks\Contracts\TaskResolver;

/**
 * Adds the tasks once Tasks confirmed, in one read, that every one exists for the actor; one missing task refuses all.
 */
final readonly class AddPhaseTasksHandler implements CommandHandler
{
    public function __construct(
        private TaskResolver $tasks,
    ) {}

    public function handle(AddPhaseTasks $command): void
    {
        $this->tasks->requireAllVisible($command->taskIds);

        Phase::query()->findOrFail($command->phaseId)->addTasksAtRevision($command->expectedRevision, $command->taskIds);
    }
}

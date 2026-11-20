<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use Domain\Plans\Commands\AddPhaseTasks;
use Domain\Plans\Handlers\Support\PlanCommandHandler;
use Domain\Plans\Models\Phase;
use Domain\Tasks\Contracts\TaskResolver;

/**
 * Adds the tasks once Tasks confirmed, in one read, that every one exists for the actor; one missing task refuses all.
 */
final readonly class AddPhaseTasksHandler extends PlanCommandHandler
{
    public function __construct(
        private TaskResolver $tasks,
    ) {}

    public function handle(AddPhaseTasks $command): void
    {
        $this->tasks->requireAllVisible($command->taskIds);

        Phase::query()->findOrFail($command->phaseId)->addTasksAtRevision(
            $command->expectedRevision,
            $command->taskIds,
        );
    }
}

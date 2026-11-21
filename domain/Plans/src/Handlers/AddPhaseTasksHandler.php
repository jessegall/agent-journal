<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use Domain\Plans\Commands\AddPhaseTasks;
use Domain\Plans\Handlers\Support\PlanCommandHandler;
use Domain\Plans\Models\Phase;
use Domain\Plans\Support\PlanStructure;
use Domain\Tasks\Contracts\TaskResolver;

/**
 * Adds the tasks once Tasks confirmed, in one read, that every one exists for the actor; one missing task refuses all.
 */
final readonly class AddPhaseTasksHandler extends PlanCommandHandler
{
    public function __construct(
        private TaskResolver $tasks,
        private PlanStructure $structure,
    ) {}

    public function handle(AddPhaseTasks $command): void
    {
        $this->tasks->requireAllVisible($command->taskIds);

        $this->structure->addTasksAtRevision(
            Phase::query()->findOrFail($command->phaseId),
            $command->expectedRevision,
            $command->taskIds,
        );
    }
}

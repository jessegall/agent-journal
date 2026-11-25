<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\AddPhaseTasks;

use Domain\Plans\Commands\Support\PlanCommandHandler;
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

    public function handle(AddPhaseTasksCommand $command): void
    {
        $this->tasks->requireAllVisible($command->taskIds);

        $phase = Phase::query()->findOrFail($command->phaseId);

        $this->structure->addTasksAtRevision(
            $phase,
            $command->expectedRevision,
            $command->taskIds,
        );
    }
}

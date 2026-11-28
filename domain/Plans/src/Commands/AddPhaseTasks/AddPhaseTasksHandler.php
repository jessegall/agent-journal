<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\AddPhaseTasks;

use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Models\Phase;
use Domain\Plans\Support\PlanStructureEditor;
use Domain\Tasks\Contracts\TaskVisibility;

/**
 * Adds the tasks once Tasks confirmed, in one read, that every one exists for the actor and is of the phase's project;
 * one missing or of another project refuses all.
 */
final readonly class AddPhaseTasksHandler extends PlanCommandHandler
{
    public function __construct(
        private TaskVisibility $tasks,
        private PlanStructureEditor $structure,
    ) {}

    public function handle(AddPhaseTasksCommand $command): void
    {
        $phase = Phase::query()->findOrFail($command->phaseId);
        $this->tasks->requireAllVisibleBeside($command->taskIds, $phase);

        $this->structure->addTasksAtRevision(
            $phase,
            $command->expectedRevision,
            $command->taskIds,
        );
    }
}

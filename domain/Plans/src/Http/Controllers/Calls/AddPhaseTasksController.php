<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Contracts\Bus\CommandBus;
use Domain\Plans\Calls\AddPhaseTasksCall;
use Domain\Plans\Calls\PhaseTasksAdded;
use Domain\Plans\Commands\AddPhaseTasks\AddPhaseTasksCommand;

/**
 * Adds tasks to a phase and answers how many.
 */
final readonly class AddPhaseTasksController
{
    public function __invoke(AddPhaseTasksCall $call, CommandBus $commands): PhaseTasksAdded
    {
        $commands->run(new AddPhaseTasksCommand($call->phaseId, $call->expectedRevision, $call->taskIds));

        return PhaseTasksAdded::from(['phaseId' => $call->phaseId, 'added' => count($call->taskIds)]);
    }
}

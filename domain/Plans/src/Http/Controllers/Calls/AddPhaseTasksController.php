<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Calls\AddPhaseTasksCall;
use Domain\Plans\Calls\PhaseTasksAdded;
use Domain\Plans\Commands\AddPhaseTasks;

/**
 * Adds tasks to a phase and answers how many.
 */
final readonly class AddPhaseTasksController
{
    public function __invoke(AddPhaseTasksCall $call, CommandBus $commands): PhaseTasksAdded
    {
        $commands->run(new AddPhaseTasks($call->phaseId, $call->expectedRevision, $call->taskIds));

        return PhaseTasksAdded::from(['phaseId' => $call->phaseId, 'added' => count($call->taskIds)]);
    }
}

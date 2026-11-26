<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Plans\Api\AddPhaseTasksPayload;
use Domain\Plans\Api\PhaseTasksAdded;
use Domain\Plans\Commands\AddPhaseTasks\AddPhaseTasksCommand;

/**
 * Adds tasks to a phase and answers how many.
 */
final readonly class AddPhaseTasksController
{
    #[Dispatches(AddPhaseTasksCommand::class)]
    public function __invoke(AddPhaseTasksPayload $call, CommandBus $commands): PhaseTasksAdded
    {
        $commands->run(new AddPhaseTasksCommand($call->phaseId, $call->expectedRevision, $call->taskIds));

        return PhaseTasksAdded::from(['phaseId' => $call->phaseId, 'added' => count($call->taskIds)]);
    }
}
